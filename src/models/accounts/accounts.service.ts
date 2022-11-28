import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEnum } from 'src/common/enums/status.enum';
import { Like, Repository, UpdateResult } from 'typeorm';
import { BaseService } from '../base/base.service';
import {
  AccountFilterDTO,
  AccountStatusFilter,
} from './dto/account-filter.dto';
import { AccountEntity } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ChangePasswordDTO } from './dto/changePassword.dto';

@Injectable()
export class AccountsService extends BaseService<AccountEntity> {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountsRepository: Repository<AccountEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(accountsRepository);
  }

  async updateRefreshToken(
    refreshToken: string,
    id: string,
  ): Promise<UpdateResult> {
    return await this.accountsRepository.update(
      { id: id },
      { refreshToken: refreshToken },
    );
  }

  async updateConfirmVerifyStatusAccount(id: string): Promise<UpdateResult> {
    return await this.accountsRepository.update(
      { id: id },
      {
        confirmedVerify: true,
        status: StatusEnum.ACTIVE,
      },
    );
  }

  async updateDeviceToken(deviceToken: string, id: string): Promise<string> {
    const result = await this.accountsRepository.update(
      { id: id },
      {
        deviceToken: deviceToken,
      },
    );
    return result.affected === 0
      ? 'Update deviceToken fail'
      : 'Update deviceToken success';
  }

  // async getAccounts(
  //   accountFilter: AccountFilterDTO,
  // ): Promise<[AccountInfoDTO[], number]> {
  //   const { currentPage, sizePage, sort, role, phone, status } = accountFilter;

  //   const [list, count] = await this.accountsRepository.findAndCount({
  //     relations: {
  //       profile: true,
  //       role: true,
  //       customer: true,
  //       shipper: true,
  //       kitchen: true,
  //     },
  //     where: {
  //       phone: Like(`%${Boolean(phone) ? phone : ''}%`),
  //       role: { name: Like(Boolean(role) ? role : '%%') },
  //       status: Like(Boolean(status) ? status : '%%'),
  //     },
  //     order: { phone: sort == SortEnum.ASCENDING ? 'ASC' : 'DESC' },
  //     skip: sizePage * (currentPage - 1),
  //     take: sizePage,
  //   });

  //   return [this.mapper.mapArray(list, AccountEntity, AccountInfoDTO), count];
  // }

  async getAccounts(
    accountFilter: AccountFilterDTO,
    statusFilter: AccountStatusFilter,
  ): Promise<AccountEntity[]> {
    // const roleFind = await this.roleService.findOne({ where: { id: role } });
    const { role } = accountFilter;
    const { status } = statusFilter;
    const accounts = await this.accountsRepository.find({
      where: {
        role: { name: Like(Boolean(role) ? role : '%%') },
        status: Like(Boolean(status) ? status : '%%'),
      },
      relations: {
        role: true,
        profile: true,
      },
    });
    if (!accounts || accounts.length == 0) {
      throw new HttpException(`No account found`, HttpStatus.NOT_FOUND);
    } else {
      return accounts;
    }
  }

  async forgotPassword(
    user: AccountEntity,
    newPassword: string,
  ): Promise<string> {
    const password = await bcrypt.hash(newPassword, 10);
    user.password = password;
    const account = await this.save(user);
    if (!Boolean(account))
      throw new HttpException('Change password failed', HttpStatus.BAD_REQUEST);
    return 'Change password success';
  }

  async changePassword(
    user: AccountEntity,
    data: ChangePasswordDTO,
  ): Promise<string> {
    const matchPass = await bcrypt.compare(data.oldPassword, user.password);
    if (!matchPass) {
      throw new HttpException(
        'Your old password is Wrong',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPass = await bcrypt.hash(data.newPassword, 10);
    user.password = newPass;
    const account = await this.save(user);
    if (!Boolean(account))
      throw new HttpException('Change password failed', HttpStatus.BAD_REQUEST);
    return 'Change password success';
  }

  async banAccount(id: string, user: AccountEntity): Promise<AccountEntity> {
    if (id === user.id)
      throw new HttpException(
        'You can not ban this you',
        HttpStatus.BAD_REQUEST,
      );

    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!Boolean(account))
      throw new HttpException('this account not found', HttpStatus.NOT_FOUND);

    // if (account.role.name === RoleEnum.ADMIN)
    //   throw new HttpException('Can not ban admin user', HttpStatus.BAD_REQUEST);

    account.status = StatusEnum.BAN;
    return await this.save(account);
  }

  async unBanAccount(id: string): Promise<AccountEntity> {
    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!Boolean(account))
      throw new HttpException('this account not found', HttpStatus.NOT_FOUND);
    account.status = StatusEnum.ACTIVE;
    return await this.save(account);
  }

  async inActiveAccount(
    id: string,
    user: AccountEntity,
  ): Promise<AccountEntity> {
    if (id === user.id)
      throw new HttpException(
        'You can not delete this you',
        HttpStatus.BAD_REQUEST,
      );

    const account = await this.accountsRepository.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!Boolean(account))
      throw new HttpException('this account not found', HttpStatus.NOT_FOUND);

    if (account.role.name === RoleEnum.ADMIN)
      throw new HttpException(
        'Can not delete admin user',
        HttpStatus.BAD_REQUEST,
      );

    account.status = StatusEnum.IN_ACTIVE;
    return await this.save(account);
  }
}
