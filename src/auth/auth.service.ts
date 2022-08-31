import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as adminFirebase from 'firebase-admin';
import { RoleEnum } from 'src/common/enums/role.enum';
// import { JwtConfigService } from 'src/config/jwt/config.service';
import { AccountsService } from 'src/models/accounts/accounts.service';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';
import { CustomersService } from 'src/models/customers/customers.service';
import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
import { ProfileEntity } from 'src/models/profiles/entities/profile.entity';
import { ProfileService } from 'src/models/profiles/profile.service';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { RolesService } from 'src/models/roles/roles.service';
import { DataSource, EntityManager } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { Payload } from './payload';
import { LoginResponseDto } from './response/login-response.dto';
import { RefreshTokenResponseDTO } from './response/refresh-token-response.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
    private readonly rolesService: RolesService,
    private readonly customerService: CustomersService,
    private readonly jwtService: JwtService,
    // private readonly jwtConfigService: JwtConfigService,
    private readonly profileService: ProfileService,
  ) {}

  // async signUpCustomer(register: RegisterCustomerDto): Promise<AccountEntity> {
  //   register.password = await bcrypt.hash(register.password, 10);

  //   const callback = async (entityManager: EntityManager): Promise<void> => {
  //     const role = await entityManager.findOne(RoleEntity, {
  //       where: { name: RoleEnum.CUSTOMER },
  //     });

  //     const accountEntity = await entityManager.save(
  //       AccountEntity,
  //       entityManager.create(AccountEntity, {
  //         ...register,
  //         role,
  //       }),
  //     );

  //     await entityManager.save(
  //       CustomerEntity,
  //       entityManager.create(CustomerEntity, {
  //         id: accountEntity.id,
  //       }),
  //     );

  //     await entityManager.save(
  //       ProfileEntity,
  //       entityManager.create(ProfileEntity, {
  //         account: accountEntity,
  //         ...register,
  //       }),
  //     );
  //   };

  //   await this.accountsService.transaction(callback, this.dataSource);

  //   return this.accountsService.findOne({
  //     relations: { role: true, customer: true },
  //     where: { username: register.username },
  //   });
  // }

  // async loginCustomer(dto: LoginDto): Promise<LoginResponseDto> {
  //   const { username, password } = dto;
  //   const user = await this.accountsService.findOne({
  //     relations: { role: true },
  //     where: { username },
  //   });

  //   if (!user)
  //     throw new HttpException('account invalid', HttpStatus.BAD_REQUEST);
  //   const isCorrectPassword = await bcrypt.compare(password, user.password);
  //   if (!isCorrectPassword)
  //     throw new HttpException('account invalid', HttpStatus.BAD_REQUEST);
  //   const role = user.role.name;
  //   const payload: Payload = { username, role };
  //   const refreshToken = this.jwtService.sign(
  //     { id: user.id },
  //     {
  //       secret: this.jwtConfigService.refreshTokenSecret,
  //       expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
  //     },
  //   );
  //   await this.accountsService.updateRefreshToken(refreshToken, user.id);
  //   return {
  //     access_token: this.jwtService.sign(payload, {
  //       secret: this.jwtConfigService.accessTokenSecret,
  //       expiresIn: this.jwtConfigService.accessTokenExpiresIn,
  //     }),
  //     refresh_token: refreshToken,
  //   };
  // }

  // async loginGoogle(token: string): Promise<LoginResponseDto> {
  //   const userFirebase = await adminFirebase.auth().verifyIdToken(token);
  //   if (!userFirebase)
  //     throw new HttpException('token invalid', HttpStatus.BAD_REQUEST);
  //   const user = await this.accountsService.findByEmail(userFirebase.email);
  //   if (!user)
  //     throw new HttpException(
  //       'This email be not signed up yet',
  //       HttpStatus.FOUND,
  //     );
  //   const role = user.role.name;
  //   const payload: Payload = { username: user.username, role };

  //   return {
  //     access_token: this.jwtService.sign(payload, {
  //       secret: this.jwtConfigService.accessTokenSecret,
  //       expiresIn: this.jwtConfigService.accessTokenExpiresIn,
  //     }),
  //     refresh_token: this.jwtService.sign(
  //       { id: user.id },
  //       {
  //         secret: this.jwtConfigService.refreshTokenSecret,
  //         expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
  //       },
  //     ),
  //   };
  // }

  // async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDTO> {
  //   const { id } = (await this.jwtService.verify(refreshToken, {
  //     secret: this.jwtConfigService.refreshTokenSecret,
  //     ignoreExpiration: false,
  //   })) as { id: string };
  //   const user = await this.accountsService.findOne({
  //     where: { id: id },
  //     relations: {
  //       role: true,
  //     },
  //   });
  //   if (!user || user.refreshToken != refreshToken) {
  //     throw new HttpException('Token invalid', HttpStatus.BAD_REQUEST);
  //   }
  //   const payload: Payload = { username: user.username, role: user.role.name };
  //   return {
  //     access_token: this.jwtService.sign(payload, {
  //       secret: this.jwtConfigService.accessTokenSecret,
  //       expiresIn: this.jwtConfigService.accessTokenExpiresIn,
  //     }),
  //   };
  // }

  async logout(user: AccountEntity): Promise<string> {
    const result = await this.accountsService.updateRefreshToken(null, user.id);
    return result.affected == 1 ? 'logout success' : 'logout failure';
  }
}
