import { DataSource, EntityManager, Like, Repository } from 'typeorm';
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
import {
  ShipperFilterDTO,
  ShipperStatusFilter,
} from './dto/shipper-status-filter.dto';
import { ShipperStatusEnum } from 'src/common/enums/shipperStatus.enum';
import { KitchenService } from '../kitchens/kitchens.service';
import { ListShipperID } from './dto/addShipper.dto';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';

@Injectable()
export class ShippersService extends BaseService<ShipperEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ShipperEntity)
    private readonly shipperRepository: Repository<ShipperEntity>,
    private readonly profileService: ProfileService,
    private readonly accountService: AccountsService,
    private readonly kitchenService: KitchenService,
  ) {
    super(shipperRepository);
  }

  async findAll(statusFilter: ShipperStatusFilter): Promise<ShipperEntity[]> {
    const { status } = statusFilter;
    return await this.shipperRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
      relations: {
        account: { profile: true },
        kitchen: true,
      },
    });
  }

  async getShipperByStatus(filter: ShipperFilterDTO): Promise<ShipperEntity[]> {
    const { statusAcc } = filter;
    const list = await this.shipperRepository.find({
      where: {
        account: { status: Like(Boolean(statusAcc) ? statusAcc : '%%') },
      },
      relations: {
        account: { profile: true },
        kitchen: { account: { profile: true } },
      },
    });
    if (!list || list.length == 0) {
      throw new HttpException('No shipper found', HttpStatus.NOT_FOUND);
    }
    return list;
  }

  async getFreeShipper(): Promise<ShipperEntity[]> {
    const listFree = [];
    const listShipper = await this.shipperRepository.find({
      relations: {
        account: { profile: true },
        kitchen: true,
      },
      where: {
        status: ShipperStatusEnum.ACTIVE,
        account: { status: AccountStatusEnum.ACTIVE },
      },
    });
    if (!listShipper || listShipper.length == 0)
      throw new HttpException('No shipper free', HttpStatus.NOT_FOUND);

    for (const item of listShipper) {
      if (item.kitchen == null) {
        listFree.push(item);
      }
    }
    return listFree;
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
    if (Boolean(checkNoPlate) && id != checkNoPlate.id) {
      throw new HttpException('noPlate already exists', HttpStatus.BAD_REQUEST);
    }

    const checkEmail = await this.profileService.findOne({
      where: { email: update.email },
    });
    if (Boolean(checkEmail) && id != checkEmail.id) {
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
        { fullName: update.fullName, email: update.email, DOB: update.DOB },
      );
    };

    await this.accountService.transaction(callback, this.dataSource);

    return this.shipperRepository.findOne({
      where: { id: id },
      relations: { account: { profile: true } },
    });
  }

  async updateStatusShipper(id: string): Promise<string> {
    const shipper = await this.shipperRepository.findOne({
      where: { id: id },
      relations: { account: true },
    });
    if (!shipper) {
      throw new HttpException(`Shipper ${id} not found`, HttpStatus.NOT_FOUND);
    }
    if (shipper.account.status == StatusEnum.ACTIVE) {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          ShipperEntity,
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );

        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.BAN },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Shipper inactive!';
    } else if (shipper.account.status == StatusEnum.BAN) {
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

  async offByShipper(user: AccountEntity): Promise<string> {
    const sfind = await this.shipperRepository.findOne({
      where: { id: user.id },
    });

    if (!sfind) {
      throw new HttpException('Shipper not found', HttpStatus.NOT_FOUND);
    }
    if (sfind.status == ShipperStatusEnum.ACTIVE) {
      const update = await this.shipperRepository.update(
        { id: user.id },
        { status: ShipperStatusEnum.IN_ACTIVE },
      );
      if (update) {
        return 'Shipper inactive';
      } else {
        return 'error to inactive';
      }
    } else if (sfind.status == ShipperStatusEnum.IN_ACTIVE) {
      const update = await this.shipperRepository.update(
        { id: user.id },
        { status: ShipperStatusEnum.ACTIVE },
      );
      if (update) {
        return 'Shipper active';
      } else {
        return 'error to active';
      }
    }
  }

  async getShipperByKitchen(
    filter: ShipperStatusFilter,
  ): Promise<ShipperEntity[]> {
    const { status } = filter;
    const kitchenFind = await this.kitchenService.findOne({
      where: { id: filter.kitchenId },
    });
    if (kitchenFind == null)
      throw new HttpException('Kitchen not found', HttpStatus.NOT_FOUND);

    const listShipper = await this.shipperRepository.find({
      where: {
        kitchen: { id: filter.kitchenId },
        status: Like(Boolean(status) ? status : '%%'),
      },
      relations: {
        account: { profile: true },
        deliveryTrips: true,
      },
    });
    if (listShipper.length == 0)
      throw new HttpException('No shipper found', HttpStatus.NOT_FOUND);
    return listShipper;
  }

  async addShipperToKitchen(dto: ListShipperID): Promise<string> {
    const kitchenFind = await this.kitchenService.findOne({
      where: { id: dto.kitchenId },
      relations: { account: true },
    });
    if (kitchenFind == null)
      throw new HttpException('Kitchen not found', HttpStatus.NOT_FOUND);
    else if (kitchenFind.account.status !== AccountStatusEnum.ACTIVE)
      throw new HttpException(
        'Only add shipper to active kitchen',
        HttpStatus.BAD_REQUEST,
      );
    if (dto.shippers.length <= 0)
      throw new HttpException('List shipper is null', HttpStatus.BAD_REQUEST);
    for (const shipper of dto.shippers) {
      const shipperFind = await this.shipperRepository.findOne({
        where: { id: shipper },
        relations: { account: { profile: true } },
      });
      if (!shipperFind || shipperFind == null)
        throw new HttpException(
          `Shipper ${shipper} not found`,
          HttpStatus.NOT_FOUND,
        );
      if (shipperFind.status !== ShipperStatusEnum.ACTIVE)
        throw new HttpException(
          `Only add active shipper (Error at: ${shipper})`,
          HttpStatus.BAD_REQUEST,
        );
      if (shipperFind.account.status !== AccountStatusEnum.ACTIVE)
        throw new HttpException(
          `Only add active account shipper (Error at: ${shipper})`,
          HttpStatus.BAD_REQUEST,
        );

      const addShipper = await this.shipperRepository.update(
        {
          id: shipperFind.id,
        },
        {
          kitchen: kitchenFind,
        },
      );
      if (!addShipper)
        throw new HttpException(`Add shipper fail`, HttpStatus.BAD_REQUEST);
    }

    return 'Add successful';
  }
}
