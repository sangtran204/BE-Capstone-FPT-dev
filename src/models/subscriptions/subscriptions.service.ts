import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/common/enums/order.enum';
import { StatusEnum } from 'src/common/enums/status.enum';
import { SubEnum } from 'src/common/enums/sub.enum';
import { Like, Repository } from 'typeorm';
import { VnpayDto } from 'src/providers/vnpay/vnpay.dto';
import { VnpayService } from 'src/providers/vnpay/vnpay.service';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { CustomersService } from '../customers/customers.service';
import { PackageService } from '../packages/packages.service';
import { PaymentsService } from '../payment/payments.service';
import { CreateSubscriptionDTO } from './dto/create-subscription';
import { SubscriptionFilter } from './dto/subscription-filter.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubHistoryDTO } from './dto/getSub-history.dto';
import e from 'express';

@Injectable()
export class SubscriptionService extends BaseService<SubscriptionEntity> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly customerService: CustomersService,
    private readonly packageService: PackageService,
    private readonly paymentsService: PaymentsService,
    private readonly vnpayService: VnpayService,
  ) {
    super(subscriptionRepository);
  }

  async getAllSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      relations: {
        customer: { account: true },
        packages: true,
      },
    });
  }

  async getSubscriptionByStatus(
    subFilter: SubscriptionFilter,
  ): Promise<SubscriptionEntity[]> {
    const { status } = subFilter;
    const list = await this.subscriptionRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
      relations: {
        customer: { account: true },
        packages: true,
      },
    });
    if (!list || list.length == 0) {
      throw new HttpException('No sub found', HttpStatus.NOT_FOUND);
    }
    return list;
  }

  async getSubscriptionByCustomer(
    subFilter: SubscriptionFilter,
    user: AccountEntity,
  ): Promise<SubHistoryDTO[]> {
    const { status } = subFilter;
    const statuss = Like(Boolean(status) ? status : '%%');
    return await this.subscriptionRepository
      .createQueryBuilder('subscriptions')
      .select(
        'subscriptions.id as id, totalPrice, startDelivery, cancelDate, subscriptions.status as status, packages.name as packageName, packages.image as packageImg',
      )
      .leftJoin('subscriptions.packages', 'packages')
      .where('subscriptions.customerId = :customerId', { customerId: user.id })
      .andWhere('subscriptions.status = :status', {
        status: statuss.value,
      })
      .execute();
  }

  async subscriptionPackage(
    dto: CreateSubscriptionDTO,
    user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    try {
      const packgeFind = await this.packageService.findOne({
        where: { id: dto.packageId },
      });
      const customerFind = await this.customerService.findOne({
        where: { id: user.id },
      });
      if (packgeFind.status !== StatusEnum.ACTIVE) {
        throw new HttpException(
          `Package is not Active`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (!packgeFind) {
        throw new HttpException(
          `PackageId ${dto.packageId} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else if (!customerFind) {
        throw new HttpException(
          `CustomerId ${user.id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        return await this.subscriptionRepository.save({
          totalPrice: dto.totalPrice,
          startDelivery: dto.startDelivery,
          customer: customerFind,
          packages: packgeFind,
        });
      }
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async findById(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
      relations: {
        packages: true,
        orders: true,
      },
    });
    if (!subscription) {
      throw new HttpException('Subsriptions not found', HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  async customerConfirm(id: string, user: AccountEntity): Promise<string> {
    const subscription = await this.findById(id);
    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    subscription.status = SubEnum.INPROGRESS;
    const updateSubscription = await this.subscriptionRepository.save(
      subscription,
    );
    if (!updateSubscription) {
      throw new HttpException('Fail to Buy', HttpStatus.BAD_REQUEST);
    }
    return 'Confirm Successful';
  }

  async doneSub(id: string, user: AccountEntity): Promise<string> {
    const subscription = await this.findById(id);

    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (subscription.status !== SubEnum.INPROGRESS) {
      throw new HttpException(
        'Only subscription with status INPROGRESS',
        HttpStatus.BAD_REQUEST,
      );
    }
    subscription.status = SubEnum.DONE;
    const updateSubscription = await this.subscriptionRepository.save(
      subscription,
    );
    if (!updateSubscription) {
      throw new HttpException('Check out fail', HttpStatus.BAD_REQUEST);
    }
    return 'Subscription done';
  }

  async cancelSubscription(id: string, user: AccountEntity): Promise<string> {
    const subscription = await this.findById(id);
    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    const dateCancel = new Date();
    if (subscription.startDelivery < dateCancel) {
      throw new HttpException('Cancel before 24h', HttpStatus.BAD_REQUEST);
    }
    subscription.status = SubEnum.CANCEL;
    subscription.cancelDate = new Date();
    const subscriptionCancel = await this.save(subscription);
    if (!subscriptionCancel) {
      throw new HttpException('Cancel Fail', HttpStatus.BAD_REQUEST);
    }
    return 'Cancel Successful';
  }

  async deleteSubscription(id: string, user: AccountEntity): Promise<string> {
    const subFind = await this.subscriptionRepository.findOne({
      where: { id: id, customer: { id: user.id }, status: SubEnum.UNCONFIRMED },
    });
    if (!subFind) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }
    const delSub = await this.subscriptionRepository
      .createQueryBuilder()
      .delete()
      .from(SubscriptionEntity)
      .where('id = :id', {
        id: id,
      })
      .andWhere('customerId = :customerId', { customerId: user.id })
      .andWhere('status = :status', { status: 'unConfirmed' })
      .execute();
    if (delSub) {
      return 'Delete success';
    } else {
      return 'Delete fail';
    }
  }

  async payment(
    vnpayDto: VnpayDto,
  ): Promise<{ message: string; code: string }> {
    const orderId = vnpayDto.vnp_OrderInfo.split(' ')[3];
    const orderPromise = this.findOne({ where: { id: orderId } });
    const paymentPromise = this.paymentsService.findOne({
      where: { transactionNo: vnpayDto.vnp_TransactionNo },
    });
    // const bankPromise = this.banksService.findOne({
    //   where: { bankCode: vnpayDto.vnp_BankCode },
    // });

    const paymentInDB = await paymentPromise;
    // Kiểm tra trong DB xem transaction này đã tồn tại chưa trong bảng payment tại cột transactionNo
    // nếu có payment chứng tỏ user đang request lần 2
    if (Boolean(paymentInDB))
      throw new HttpException(
        'This transaction invalid',
        HttpStatus.BAD_REQUEST,
      );

    const result = this.vnpayService.returnUrl(vnpayDto);
    if (!result || result.message !== 'success')
      throw new HttpException('You payment failed', HttpStatus.BAD_REQUEST);

    const order = await orderPromise;
    if (!Boolean(order))
      throw new HttpException(
        `this order [${orderId}] not existed`,
        HttpStatus.BAD_REQUEST,
      );

    // thêm thông tin transaction này vào DB tại bảng payment
    // const bank = await bankPromise;
    const {
      vnp_PayDate,
      vnp_TransactionStatus,
      vnp_TransactionNo,
      vnp_BankTranNo,
      vnp_OrderInfo,
      vnp_CardType,
      vnp_Amount,
    } = vnpayDto;
    await this.paymentsService.save({
      // bank,
      orderInfo: vnp_OrderInfo,
      amount: parseInt(vnp_Amount),
      transactionNo: vnp_TransactionNo,
      transactionStatus: vnp_TransactionStatus,
      // bankTranNo: vnp_BankTranNo,
      cardType: vnp_CardType,
      payDate: vnp_PayDate,
      // order: order,
    });

    order.status = OrderEnum.PENDING;
    await this.save(order);

    return result;
  }
}
