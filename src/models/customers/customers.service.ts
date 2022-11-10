import { Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { BaseService } from '../base/base.service';
import { AccountEntity } from '../accounts/entities/account.entity';
import { SubFilter } from './dto/customer-sub-filter.dto';

@Injectable()
export class CustomersService extends BaseService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {
    super(customerRepository);
  }

  async getSubByCustomer(
    user: AccountEntity,
    subFilter: SubFilter,
  ): Promise<CustomerEntity[]> {
    const { status } = subFilter;
    return await this.customerRepository.find({
      where: {
        id: user.id,
        subscriptions: { status: Like(Boolean(status) ? status : '%%') },
      },
      relations: { subscriptions: { packages: true } },
    });
  }
}
