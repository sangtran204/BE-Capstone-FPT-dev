import { DataSource, EntityManager, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { ShipperEntity } from './entities/shipper.entity';
import { ProfileService } from '../profiles/profile.service';
import { UpdateShipperDTO } from './dto/update_shipper';
import { AccountsService } from '../accounts/accounts.service';
import { ProfileEntity } from '../profiles/entities/profile.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { AccountEntity } from '../accounts/entities/account.entity';

@Injectable()
export class ShippersService extends BaseService<ShipperEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ShipperEntity)
    private readonly shipperRepository: Repository<ShipperEntity>,
    private readonly profileService: ProfileService,
    private readonly accountService: AccountsService,
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

  async updateShipper(
    id: string,
    update: UpdateShipperDTO,
  ): Promise<ShipperEntity> {
    const shipper = await this.shipperRepository.findOne({
      where: { id: update.id },
    });
    if (!shipper) {
      throw new HttpException(
        `Shipper id ${update.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const checkNoPlate = await this.shipperRepository.findOne({
      where: { noPlate: update.noPlate },
    });
    if (Boolean(checkNoPlate)) {
      throw new HttpException('noPlate already exists', HttpStatus.BAD_REQUEST);
    }

    const checkEmail = await this.profileService.findOne({
      where: { email: update.email },
    });
    if (Boolean(checkEmail)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const callback = async (entityManager: EntityManager): Promise<void> => {
      await entityManager.update(
        ShipperEntity,
        { id: id },
        { noPlate: update.noPlate, vehicleType: update.vehicleType },
      );

      await entityManager.update(
        ProfileEntity,
        { id: id },
        { fullName: update.fullName, email: update.email },
      );
    };

    await this.accountService.transaction(callback, this.dataSource);

    return this.shipperRepository.findOne({
      where: { id: id },
      relations: { account: { profile: true } },
    });
  }

  async updateStatusShipper(id: string): Promise<string> {
    const shipper = await this.shipperRepository.findOne({ where: { id: id } });
    if (!shipper) {
      throw new HttpException(`Shipper ${id} not found`, HttpStatus.NOT_FOUND);
    }
    if (shipper.status == StatusEnum.ACTIVE) {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          ShipperEntity,
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );

        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Shipper inactive!';
    } else {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          ShipperEntity,
          { id: id },
          { status: StatusEnum.ACTIVE },
        );

        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Shipper active!';
    }
  }
}
