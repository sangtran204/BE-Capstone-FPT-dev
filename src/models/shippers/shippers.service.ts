import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { ShipperEntity } from './entities/shipper.entity';

@Injectable()
export class ShippersService extends BaseService<ShipperEntity> {
  constructor(
    @InjectRepository(ShipperEntity)
    private readonly shipperRepository: Repository<ShipperEntity>,
  ) {
    super(shipperRepository);
  }

  async findAll(): Promise<ShipperEntity[]> {
    return await this.shipperRepository.find({
      relations: {
        account: { profile: true },
        kitchen: true,
      },
    });
  }
}
