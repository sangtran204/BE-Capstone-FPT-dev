import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { ShipperEntity } from './entities/shipper.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
import { KitchenService } from '../kitchens/kitchens.service';

@Injectable()
export class ShippersService extends BaseService<ShipperEntity> {
  constructor(
    @InjectRepository(ShipperEntity)
    private readonly shipperRepository: Repository<ShipperEntity>,
    private readonly kitchenService: KitchenService,
  ) {
    super(shipperRepository);
  }

  async findAll(): Promise<ShipperEntity[]> {
    return await this.shipperRepository.find({
      relations: {
        account: { profile: true },
      },
    });
  }

  async getShipperByKitchenID(
    idHotel: string,
    user: AccountEntity,
  ): Promise<ShipperEntity[]> {
    const kitchen = await this.kitchenService.findOne({
      where: { id: idHotel },
    });
    if (!kitchen) {
      throw new HttpException('Not found kitchen', HttpStatus.NOT_FOUND);
    }
    if (user.id !== kitchen.id) {
      throw new HttpException(
        'You are not owner this shipper',
        HttpStatus.BAD_REQUEST,
      );
    }
    const shipperList = await this.shipperRepository
      .createQueryBuilder('shippers')
      .leftJoinAndSelect('shippers.kitchen', 'kitchens')
      .where('kitchens.id= :id', {
        id: idHotel,
      })
      .getMany();
    return shipperList;
  }
}
