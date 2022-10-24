import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';
import { SubEnum } from 'src/common/enums/sub.enum';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { CustomersService } from '../customers/customers.service';
import { PackageService } from '../packages/packages.service';
import { CreateSubscriptionDTO } from './dto/create-subscription';
import { SubscriptionEntity } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService extends BaseService<SubscriptionEntity> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
    private readonly customerService: CustomersService,
    private readonly packageService: PackageService,
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
}
