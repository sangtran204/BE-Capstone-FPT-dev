import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';
import { SubEnum } from 'src/common/enums/sub.enum';
import { Like, Repository } from 'typeorm';
import { VnpayDto } from 'src/providers/vnpay/vnpay.dto';
import { VnpayService } from 'src/providers/vnpay/vnpay.service';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { PackageService } from '../packages/packages.service';
import { PaymentsService } from '../payment/payments.service';
import { CreateSubscriptionDTO } from './dto/create-subscription';
import { SubscriptionFilter } from './dto/subscription-filter.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubHistoryDTO } from './dto/getSub-history.dto';
import { BanksService } from '../banks/banks.service';
import { OrdersService } from '../orders/order.service';
import { NotificationsService } from '../notifications/notifications.service';
// import { TypeNotificationEnum } from 'src/common/enums/notification.enum';
import { FirebaseMessageService } from 'src/providers/firebase/message/firebase-message.service';
import { AccountsService } from '../accounts/accounts.service';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class SubscriptionService extends BaseService<SubscriptionEntity> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly packageService: PackageService,
    private readonly paymentsService: PaymentsService,
    private readonly vnpayService: VnpayService,
    private readonly banksService: BanksService,
    private readonly accountService: AccountsService,
    private readonly notificationsService: NotificationsService,
    private readonly firebaseMessageService: FirebaseMessageService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
  ) {
    super(subscriptionRepository);
  }

  async getAllSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      relations: {
        account: { profile: true },
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
        account: { profile: true },
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
    const statusCompare = Like(Boolean(status) ? status : '%%');
    return await this.subscriptionRepository
      .createQueryBuilder('subscriptions')
      .select(
        'subscriptions.id as id, totalPrice, subscriptionDate, subscriptions.status as status, packages.name as packageName, packages.image as packageImg',
      )
      .leftJoin('subscriptions.packages', 'packages')
      .where('subscriptions.account.id = :id', { id: user.id })
      .andWhere('subscriptions.status = :status', {
        status: statusCompare.value,
      })
      .orderBy('subscriptionDate', 'DESC')
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
      const customerFind = await this.accountService.findOne({
        where: { id: user.id },
        relations: { role: true },
      });

      if (customerFind.role.name !== RoleEnum.CUSTOMER) {
        throw new HttpException(
          `Only Customer can do this function`,
          HttpStatus.NOT_FOUND,
        );
      }
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
          subscriptionDate: dto.subscriptionDate,
          account: customerFind,
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

  async cusFindSubById(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
      relations: {
        // packages: true,
        // orders: { station: true, timeSlot: true },
      },
    });
    if (!subscription) {
      throw new HttpException('Subsriptions not found', HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  async customerConfirm(id: string, user: AccountEntity): Promise<string> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
      relations: { orders: true, account: true },
    });
    if (subscription.account.id !== user.id) {
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
    } else {
      await this.orderService.confirmSubOrder(subscription.orders);
    }
    // if (Boolean(subscription)) {
    //   const title = `Gói ăn đã được thanh toán bởi ${user.profile.fullName}`;
    //   const body = `Gói ăn: ${subscription.packages.name}`;
    //   const data = { ['id']: subscription.id };
    //   const saveNotify = this.notificationsService.save({
    //     account: { id: user.id },
    //     title,
    //     body,
    //     data: JSON.stringify(data),
    //     type: TypeNotificationEnum.ORDER,
    //   });
    //   const sendNotify = this.firebaseMessageService.sendCustomNotification(
    //     user.deviceToken,
    //     title,
    //     body,
    //     data,
    //   );
    //   await saveNotify;
    //   await sendNotify;
    // }
    return 'Confirm Successful';
  }

  async doneSub(id: string, user: AccountEntity): Promise<string> {
    const subscription = await this.findById(id);

    if (subscription.account.id !== user.id) {
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

  // async cancelSubscription(id: string, user: AccountEntity): Promise<string> {
  //   const subscription = await this.findById(id);
  //   if (subscription.customer.id !== user.customer.id) {
  //     throw new HttpException(
  //       'You are not the owner of this subscription',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const dateCancel = new Date();
  //   if (subscription.startDelivery < dateCancel) {
  //     throw new HttpException('Cancel before 24h', HttpStatus.BAD_REQUEST);
  //   }
  //   subscription.status = SubEnum.CANCEL;
  //   subscription.cancelDate = new Date();
  //   const subscriptionCancel = await this.save(subscription);
  //   if (!subscriptionCancel) {
  //     throw new HttpException('Cancel Fail', HttpStatus.BAD_REQUEST);
  //   }
  //   return 'Cancel Successful';
  // }

  async deleteSubscription(id: string, user: AccountEntity): Promise<string> {
    const subFind = await this.subscriptionRepository.findOne({
      where: { id: id, account: { id: user.id }, status: SubEnum.UNCONFIRMED },
      relations: { orders: true },
    });
    if (!subFind) {
      throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
    }
    if (!subFind.orders || subFind.orders.length == 0) {
      const delSub = await this.subscriptionRepository
        .createQueryBuilder()
        .delete()
        .from(SubscriptionEntity)
        .where('id = :id', {
          id: id,
        })
        .andWhere('account.id = :customerId', { customerId: user.id })
        .andWhere('status = :status', { status: 'unConfirmed' })
        .execute();
      if (delSub) {
        return 'Delete success';
      } else {
        return 'Delete fail';
      }
    } else {
      const delOrders = await this.orderService.deleteSubOrder(subFind.orders);
      if (delOrders) {
        const delSub = await this.subscriptionRepository
          .createQueryBuilder()
          .delete()
          .from(SubscriptionEntity)
          .where('id = :id', {
            id: id,
          })
          .andWhere('account.id = :customerId', { customerId: user.id })
          .andWhere('status = :status', { status: 'unConfirmed' })
          .execute();
        if (delSub) {
          return 'Delete success';
        } else {
          return 'Delete fail';
        }
      } else {
        return 'Delete fail';
      }
    }
  }

  async getPaymentUrl(
    ip: string,
    bankId: string,
    subId: string,
  ): Promise<string> {
    const subPromise = this.findOne({ where: { id: subId } });
    const bankPromise = this.banksService.findOne({ where: { id: bankId } });

    const sub = await subPromise;
    if (!Boolean(sub))
      throw new HttpException(`this sub not existed`, HttpStatus.BAD_REQUEST);
    // const twoHours = 2 * 60 * 60 * 1000;
    // if (sub.createdAt.getTime() + twoHours < Date.now()) {
    //   sub.status = SubEnum.CANCEL;
    //   await this.save(sub);
    //   throw new HttpException('Your sub expired', HttpStatus.BAD_REQUEST);
    // }

    const bank = await bankPromise;
    if (!Boolean(bank))
      throw new HttpException(
        'this bank not supported',
        HttpStatus.BAD_REQUEST,
      );

    const orderInfo = `payment for order ${sub.id}`;

    const result = this.vnpayService.payment(
      ip,
      sub.totalPrice,
      bank.bankCode,
      orderInfo,
      'other',
      '',
    );
    return result;
  }

  async payment(
    vnpayDto: VnpayDto,
  ): Promise<{ message: string; code: string }> {
    const subId = vnpayDto.vnp_OrderInfo.split(' ')[3];
    const subPromise = this.findOne({ where: { id: subId } });
    const paymentPromise = this.paymentsService.findOne({
      where: { transactionNo: vnpayDto.vnp_TransactionNo },
    });
    const bankPromise = this.banksService.findOne({
      where: { bankCode: vnpayDto.vnp_BankCode },
    });

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

    const sub = await subPromise;
    if (!Boolean(sub))
      throw new HttpException(
        `this sub [${subId}] not existed`,
        HttpStatus.BAD_REQUEST,
      );

    // thêm thông tin transaction này vào DB tại bảng payment
    const bank = await bankPromise;
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
      bank,
      orderInfo: vnp_OrderInfo,
      amount: parseInt(vnp_Amount),
      transactionNo: vnp_TransactionNo,
      transactionStatus: vnp_TransactionStatus,
      bankTranNo: vnp_BankTranNo,
      cardType: vnp_CardType,
      payDate: vnp_PayDate,
      subscription: sub,
      // order: order,
    });

    sub.status = SubEnum.INPROGRESS;
    await this.save(sub);

    return result;
  }
}
