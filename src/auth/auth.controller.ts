import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { AuthService } from './auth.service';
import { CheckPhoneDTO, LoginDto } from './dto/login.dto';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { RegisterAccountDTO } from './dto/register-account.dto';
import { RegisterCustomerDTO } from './dto/register-customer.dto';
// import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterKitchenDTO } from './dto/register-kitchen.dto';
import { RegisterShipperDTO } from './dto/register-shipper.dto';
// import { VerifySignUp } from './dto/verify-signup.dto';
// import { VerifySignUp } from './dto/verify-signup.dto';
import { LoginResponseDto } from './response/login-response.dto';
import { RefreshTokenResponseDTO } from './response/refresh-token-response.dto';

@ApiBearerAuth()
@Controller('auths')
@ApiTags('auths')
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('/checkPhone')
  @Public()
  async checkExistPhone(
    @Body() phone: CheckPhoneDTO,
  ): Promise<LoginResponseDto> {
    return await this.authService.checkPhoneExist(phone);
  }

  @Post('/checkPhone_shipper')
  @Public()
  async checkExistPhoneShipper(
    @Body() phone: CheckPhoneDTO,
  ): Promise<LoginResponseDto> {
    return await this.authService.checkPhoneShipperExist(phone);
  }

  @Post('/checkPhone_customer')
  @Public()
  async checkExistPhoneCustomer(
    @Body() phone: CheckPhoneDTO,
  ): Promise<LoginResponseDto> {
    return await this.authService.checkPhoneCustomerExist(phone);
  }

  @Post('sign-up/customer')
  @Public()
  async signUpCustomer(
    @Body() dto: RegisterCustomerDTO,
  ): Promise<AccountEntity> {
    return await this.authService.signUpCustomer(dto);
  }

  // @Post('/verify/sign-up/customer')
  // @Public()
  // async verifySignUpTourist(@Body() dto: VerifySignUp): Promise<string> {
  //   return await this.authService.verifySignUp(dto);
  // }

  @Roles(RoleEnum.ADMIN)
  @Post('register/shipper')
  async registerShipper(
    @Body() dto: RegisterShipperDTO,
  ): Promise<AccountEntity> {
    return await this.authService.registerShipper(dto);
  }

  @Roles(RoleEnum.ADMIN)
  @Post('register/kitchen')
  async registerKitchen(
    @Body() dto: RegisterKitchenDTO,
  ): Promise<AccountEntity> {
    return await this.authService.registerKitchen(dto);
  }

  @Roles(RoleEnum.ADMIN)
  @Post('register/admin')
  async registerAdmin(@Body() dto: RegisterAccountDTO): Promise<AccountEntity> {
    return await this.authService.signUpAdmin(dto);
  }

  @Roles(RoleEnum.ADMIN)
  @Post('register/manager')
  async registerManager(
    @Body() dto: RegisterAccountDTO,
  ): Promise<AccountEntity> {
    return await this.authService.signUpManager(dto);
  }

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.loginAll(dto);
  }

  @Post('login/customer')
  @Public()
  async loginCustomer(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto, RoleEnum.CUSTOMER);
  }

  @Post('login/shipper')
  @Public()
  async loginShipper(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto, RoleEnum.SHIPPER);
  }

  // @Post('login/kitchen')
  // @Public()
  // async loginKitchen(@Body() dto: LoginDto): Promise<LoginResponseDto> {
  //   return await this.authService.login(dto, RoleEnum.KITCHEN);
  // }

  // @Post('login/manager')
  // @Public()
  // async loginManager(@Body() dto: LoginDto): Promise<LoginResponseDto> {
  //   return await this.authService.login(dto, RoleEnum.MANAGER);
  // }

  // @Post('login/admin')
  // @Public()
  // async loginAdmin(@Body() dto: LoginDto): Promise<LoginResponseDto> {
  //   return await this.authService.login(dto, RoleEnum.ADMIN);
  // }

  @Post('refreshToken')
  @Public()
  async refreshToken(
    @Body() dto: RefreshTokenDTO,
  ): Promise<RefreshTokenResponseDTO> {
    return await this.authService.refreshToken(dto.refresh_token);
  }

  @Post('logout')
  async logout(@GetUser() user: AccountEntity): Promise<string> {
    return await this.authService.logout(user);
  }
}
