import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getData } from './data';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { ProfileEntity } from 'src/models/profiles/entities/profile.entity';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import { AccountStatusEnum } from 'src/common/enums/accountStatus.enum';

@Injectable()
export class AccountsSeederService {
  constructor(private readonly dataSource: DataSource) {}
  async addData(): Promise<void> {
    const roles = await this.dataSource
      .createQueryBuilder(RoleEntity, 'roles')
      .select()
      .getMany();
    const data = getData();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const manager = queryRunner.manager;
    try {
      for (let i = 0, length = data.length; i < length; i++) {
        const { phone, password, status, role, fullName, dob, avatar, email } =
          data[i];

        const roleInDB = roles.find((roleInDB) => roleInDB.name === role);
        const account = await manager.save(
          AccountEntity,
          manager.create(AccountEntity, {
            phone,
            password,
            role: roleInDB,
            status,
          }),
        );

        await manager.save(
          ProfileEntity,
          manager.create(ProfileEntity, {
            id: account.id,
            fullName,
            DOB: dob,
            avatar,
            email,
            account,
          }),
        );

        // if (account.role.name === RoleEnum.CUSTOMER) {
        //   await manager.save(
        //     CustomerEntity,
        //     manager.create(CustomerEntity, {
        //       id: account.id,
        //       address: 'NVL_GV',
        //     }),
        //   );
        // }

        if (account.role.name === RoleEnum.KITCHEN) {
          await manager.save(
            KitchenEntity,
            manager.create(KitchenEntity, {
              id: account.id,
              address: 'Q9',
            }),
          );
        }

        if (account.role.name === RoleEnum.SHIPPER) {
          await manager.save(
            ShipperEntity,
            manager.create(ShipperEntity, {
              id: account.id,
              noPlate: 'ABC123',
              vehicleType: 'wave',
              status: AccountStatusEnum.ACTIVE,
            }),
          );
        }
      }
      await queryRunner.commitTransaction();
      console.info('++ Create account success');
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
