import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/common/enums/order.enum';
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
    @InjectMapper() private readonly mapper: Mapper,
    private readonly customerService: CustomersService,
    private readonly packageService: PackageService,
  ) {
    super(subscriptionRepository);
  }

  async getAllSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find({
      relations: {
        customer: { account: { profile: true } },
        packages: { packageItem: { foodGroups: { foods: true } } },
      },
    });
  }

  async subscriptionPackage(
    dto: CreateSubscriptionDTO,
  ): Promise<SubscriptionEntity> {
    const packgeFind = await this.packageService.findOne({
      where: { id: dto.packageId },
    });
    const customerFind = await this.customerService.findOne({
      where: { id: dto.customerId },
    });
    if (!packgeFind) {
      throw new HttpException(
        `PackageId ${dto.packageId} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else if (!customerFind) {
      throw new HttpException(
        `CustomerId ${dto.customerId} not found`,
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
  }

  async findById(id: string): Promise<SubscriptionEntity> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: id },
      relations: {
        customer: { account: { profile: true } },
        packages: { packageItem: { foodGroups: { foods: true } } },
      },
    });
    if (!subscription) {
      throw new HttpException('Subsriptions not found', HttpStatus.NOT_FOUND);
    }
    return subscription;
  }

  async checkIn(id: string, user: AccountEntity): Promise<SubscriptionEntity> {
    const subscription = await this.findById(id);
    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    subscription.status = OrderEnum.PENDING;
    const updateSubscription = await this.subscriptionRepository.save(
      subscription,
    );
    if (!updateSubscription) {
      throw new HttpException('Can not check in', HttpStatus.BAD_REQUEST);
    }
    return updateSubscription;
  }

  async checkOut(id: string, user: AccountEntity): Promise<SubscriptionEntity> {
    const subscription = await this.findById(id);
    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    subscription.status = OrderEnum.DONE;
    const updateSubscription = await this.subscriptionRepository.save(
      subscription,
    );
    if (!updateSubscription) {
      throw new HttpException('Can not check in', HttpStatus.BAD_REQUEST);
    }
    return updateSubscription;
  }

  async cancelSubscription(
    id: string,
    user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    const subscription = await this.findById(id);
    if (subscription.customer.id !== user.customer.id) {
      throw new HttpException(
        'You are not the owner of this subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
    subscription.status = OrderEnum.CANCEL;
    subscription.cancelDate = new Date();
    const subscriptionCancel = await this.save(subscription);
    return subscriptionCancel;
  }
}
