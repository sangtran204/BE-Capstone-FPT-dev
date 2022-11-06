import { MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
  Query,
  Put,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountsService } from './accounts.service';
import { AccountFilterDTO } from './dto/account-filter.dto';
import { AccountInfoDTO } from './dto/account-info..dto';
import { ForgotPasswordDTO } from './dto/forgotPassword.dto';
import { DeviceTokenDTO } from './dto/deviceToken.dto';
import { AccountEntity } from './entities/account.entity';
import { ChangePasswordDTO } from './dto/changePassword.dto';

@Controller('accounts')
@ApiBearerAuth()
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/find/:id')
  @UseInterceptors(MapInterceptor(AccountEntity, AccountInfoDTO))
  async getUserById(@Param('id') id: string): Promise<AccountEntity> {
    const accounts = await this.accountsService.findOne({
      where: { id: id },
      relations: {
        role: true,
        profile: true,
        customer: true,
        shipper: true,
        kitchen: true,
      },
    });
    if (!accounts)
      throw new HttpException("Don't have resource", HttpStatus.NOT_FOUND);
    return accounts;
  }

  @Get('/me')
  @UseInterceptors(MapInterceptor(AccountEntity, AccountInfoDTO))
  async getMe(@GetUser() user: AccountEntity): Promise<AccountEntity> {
    return await this.accountsService.findOne({
      where: { id: user.id },
      relations: {
        profile: true,
        role: true,
        customer: true,
        shipper: true,
        kitchen: true,
      },
    });
  }

  // @Get()
  // @Roles(RoleEnum.ADMIN)
  // async getAll(
  //   @Query() accountFilter: AccountFilterDTO,
  // ): Promise<IPaginate<AccountInfoDTO>> {
  //   const data = await this.accountsService.getAccounts(accountFilter);
  //   return paginate<AccountInfoDTO>(
  //     data,
  //     accountFilter.currentPage,
  //     accountFilter.sizePage,
  //   );
  // }

  @Get()
  @Roles(RoleEnum.ADMIN)
  async getAll(
    @Query() accountFilter: AccountFilterDTO,
  ): Promise<AccountEntity[]> {
    return await this.accountsService.getAccounts(accountFilter);
  }

  @Post('/deviceToken')
  async updateDeviceToken(
    @GetUser() user: AccountEntity,
    @Body() body: DeviceTokenDTO,
  ): Promise<string> {
    return await this.accountsService.updateDeviceToken(
      body.deviceToken,
      user.id,
    );
  }

  @Put('/forgotPassword')
  async forgotPassword(
    @GetUser() user: AccountEntity,
    @Body() dto: ForgotPasswordDTO,
  ): Promise<string> {
    return await this.accountsService.forgotPassword(user, dto.password);
  }

  @Put('/changePassword')
  async changePassword(
    @GetUser() user: AccountEntity,
    @Body() dto: ChangePasswordDTO,
  ): Promise<string> {
    return await this.accountsService.changePassword(user, dto);
  }

  @Put('/ban/:id')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(MapInterceptor(AccountEntity, AccountInfoDTO))
  async banAccount(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<AccountEntity> {
    return await this.accountsService.banAccount(id, user);
  }

  @Put('/unBan/:id')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(MapInterceptor(AccountEntity, AccountInfoDTO))
  async unBanAccount(
    @Param('id') id: string,
    // @GetUser() user: AccountEntity,
  ): Promise<AccountEntity> {
    return await this.accountsService.unBanAccount(id);
  }

  @Put('inActive/:id')
  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(MapInterceptor(AccountEntity, AccountInfoDTO))
  async deleteAccount(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<AccountEntity> {
    return await this.accountsService.inActiveAccount(id, user);
  }
}
