import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { SubscriptionEntity } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService extends BaseService<SubscriptionEntity> {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>,
  ) {
    super(subscriptionRepository);
  }

  // asyn subscriptionPackage
}
