import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { PaymentEntity } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService extends BaseService<PaymentEntity> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
  ) {
    super(paymentsRepository);
  }
}
