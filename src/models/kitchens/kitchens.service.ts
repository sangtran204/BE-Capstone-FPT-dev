import { DataSource, EntityManager, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { KitchenEntity } from './entities/kitchens.entity';
import { ProfileService } from '../profiles/profile.service';
import { UpdateKitchenDTO } from './dto/update_kitchen.dto';
import { ProfileEntity } from '../profiles/entities/profile.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { AccountsService } from '../accounts/accounts.service';
import { ListShipperID } from './dto/add_shipper.dto';
import { ShipperEntity } from '../shippers/entities/shipper.entity';
import { ShippersService } from '../shippers/shippers.service';
import { ShipperStatusEnum } from 'src/common/enums/shipperStatus.enum';

@Injectable()
export class KitchenService extends BaseService<KitchenEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(KitchenEntity)
    private readonly kitchensRepository: Repository<KitchenEntity>,
    private readonly profileService: ProfileService,
    private readonly accountService: AccountsService,
    private readonly shipperService: ShippersService,
  ) {
    super(kitchensRepository);
  }

  async findAll(): Promise<KitchenEntity[]> {
    return await this.kitchensRepository.find({
      relations: {
        account: true,
      },
    });
  }

  async updateKitchen(
    id: string,
    update: UpdateKitchenDTO,
  ): Promise<KitchenEntity> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`Kitchen ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const checkEmail = await this.profileService.findOne({
      where: { email: update.email },
    });
    if (Boolean(checkEmail) && id != checkEmail.id) {
      throw new HttpException(
        `Email ${update.email} existed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const callback = async (entityManager: EntityManager): Promise<void> => {
      await entityManager.update(
        KitchenEntity,
        { id: id },
        { address: update.address, ability: update.ability },
      );
      await entityManager.update(
        ProfileEntity,
        { id: id },
        { fullName: update.fullName, email: update.email },
      );
    };
    await this.profileService.transaction(callback, this.dataSource);
    return await this.kitchensRepository.findOne({
      where: { id: id },
      relations: { account: { profile: true } },
    });
  }

  async updateStatusKitchen(id: string): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
      relations: { account: true },
    });
    if (!kitchen) {
      throw new HttpException(`Kitchen ${id} not found`, HttpStatus.NOT_FOUND);
    }

    if (kitchen.account.status == StatusEnum.ACTIVE) {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Kitchen inactive!';
    } else {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Kitchen active!';
    }
  }

  async addShipperForKitchen(
    idKitchen: string,
    data: ListShipperID,
  ): Promise<string> {
    const listShipper: ShipperEntity[] = [];
    const nameShipper: string[] = [];
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: idKitchen },
      relations: { shippers: true, account: true },
    });
    if (!kitchen) {
      throw new HttpException(
        `Kitchen ${idKitchen} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (kitchen.account.status !== StatusEnum.ACTIVE) {
        throw new HttpException(
          `Only Account Kitchen with status ACTIVE (ERROR AT: ${kitchen.id})`,
          HttpStatus.BAD_REQUEST,
        );
      }
      for (const item of kitchen.shippers) {
        for (const { idShipper } of data.shippers) {
          const itemShipper = await this.shipperService.findOne({
            where: { id: idShipper },
            relations: { account: true },
          });
          if (!itemShipper) {
            throw new HttpException(
              `Shipper ${idShipper} not found`,
              HttpStatus.NOT_FOUND,
            );
          }
          if (itemShipper.account.status !== StatusEnum.ACTIVE) {
            throw new HttpException(
              `Only Account Shipper with status ACTIVE (ERROR AT: ${kitchen.id})`,
              HttpStatus.BAD_REQUEST,
            );
          }
          if (itemShipper.status !== ShipperStatusEnum.NEW) {
            throw new HttpException(
              `Only shipper with status NEW can add (ERROR AT: ${itemShipper.id})`,
              HttpStatus.BAD_REQUEST,
            );
          }

          if (item.id === itemShipper.id) {
            nameShipper.push(item.vehicleType);
          } else {
            listShipper.push(itemShipper);
          }
        }
      }

      if (nameShipper.length > 0) {
        let itemShipperStr = '';
        for (const item of nameShipper) {
          if (nameShipper.length > 1) {
            itemShipperStr += item + ' & ';
          } else {
            itemShipperStr += item;
          }
        }
        itemShipperStr = itemShipperStr.substring(
          0,
          itemShipperStr.lastIndexOf('&'),
        );
        throw new HttpException(
          `${itemShipperStr} has already in Kitchen ( ${kitchen.address} )`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.kitchensRepository
        .createQueryBuilder()
        .relation(KitchenEntity, 'shippers')
        .of(idKitchen)
        .add(
          data.shippers.map((item) => {
            const callback = async (
              entityManager: EntityManager,
            ): Promise<void> => {
              await entityManager.update(
                ShipperEntity,
                { id: item.idShipper },
                { status: StatusEnum.WAITING },
              );
            };
            this.accountService.transaction(callback, this.dataSource);
            return item.idShipper;
          }),
        );

      return `Add shipper for kitchen successfully ${idKitchen}`;
    }

    // if (kitchen.account.status == StatusEnum.ACTIVE) {
    //   const callback = async (entityManager: EntityManager): Promise<void> => {
    //     await entityManager.update(
    //       AccountEntity,
    //       { id: id },
    //       { status: StatusEnum.IN_ACTIVE },
    //     );
    //   };
    //   await this.accountService.transaction(callback, this.dataSource);
    //   return 'Kitchen inactive!';
    // } else {
    //   const callback = async (entityManager: EntityManager): Promise<void> => {
    //     await entityManager.update(
    //       AccountEntity,
    //       { id: id },
    //       { status: StatusEnum.ACTIVE },
    //     );
    //   };
    //   await this.accountService.transaction(callback, this.dataSource);
    //   return 'Kitchen active!';
    // }
  }
}
