import { Repository, UpdateResult } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { ShipperEntity } from './entities/shippers.entity';
import { IsActiveEnum } from '../../common/enums/isActive.enum';
import { ShipperDTO } from './dto/shippers.dto';

@Injectable()
export class ShippersService extends BaseService<ShipperEntity> {
  constructor(
    @InjectRepository(ShipperEntity)
    private readonly shippersRepository: Repository<ShipperEntity>,
  ) {
    super(shippersRepository);
  }

  async getAllShippers(): Promise<ShipperEntity[]> {
    return await this.shippersRepository.find({
      where: { isActive: IsActiveEnum.ACTIVE },
    });
  }

  async createShipper(dto: ShipperDTO): Promise<boolean> {
    try {
      await this.shippersRepository.save({
        fullName: dto.fullName,
        address: dto.address,
        email: dto.email,
        phone: dto.phone,
        gender: dto.gender,
        dob: dto.dob,
        avatar: dto.avatar,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteShipper(id: string): Promise<boolean> {
    const shipperId = await this.shippersRepository.findOne({
      where: { id: id },
    });
    if (shipperId == null) {
      return false;
    } else {
      if (shipperId.isActive == IsActiveEnum.ACTIVE) {
        await this.shippersRepository.update(
          { id: id },
          { isActive: IsActiveEnum.IN_ACTIVE },
        );
      } else if (shipperId.isActive == IsActiveEnum.IN_ACTIVE) {
        await this.shippersRepository.update(
          { id: id },
          { isActive: IsActiveEnum.ACTIVE },
        );
      }
      return true;
    }
  }

  async updateShipper(id: string, dto: ShipperDTO): Promise<boolean> {
    const shipperId = await this.shippersRepository.findOne({
      where: { id: id },
    });
    if (shipperId == null) {
      return false;
    } else {
      await this.shippersRepository.update(
        { id: id },
        {
          fullName: dto.fullName,
          address: dto.address,
          phone: dto.phone,
          email: dto.email,
          gender: dto.gender,
          dob: dto.dob,
          avatar: dto.avatar,
        },
      );
      return true;
    }
  }
}