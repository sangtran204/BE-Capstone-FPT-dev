import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/common/enums/role.enum';
import { ShipperStatusEnum } from 'src/common/enums/shipperStatus.enum';
import { StatusEnum } from 'src/common/enums/status.enum';
import { JwtConfigService } from 'src/config/jwt/config.service';
import { AccountsService } from 'src/models/accounts/accounts.service';
import { AccountEntity } from 'src/models/accounts/entities/account.entity';

import { KitchenEntity } from 'src/models/kitchens/entities/kitchens.entity';
import { KitchenService } from 'src/models/kitchens/kitchens.service';
import { ProfileEntity } from 'src/models/profiles/entities/profile.entity';
import { ProfileService } from 'src/models/profiles/profile.service';
import { RoleEntity } from 'src/models/roles/entities/role.entity';
import { RolesService } from 'src/models/roles/roles.service';
import { ShipperEntity } from 'src/models/shippers/entities/shipper.entity';
import { ShippersService } from 'src/models/shippers/shippers.service';
import { SharedService } from 'src/shared/shared.service';
import { DataSource, EntityManager } from 'typeorm';
import { CheckPhoneDTO, LoginDto } from './dto/login.dto';
import { RegisterAccountDTO } from './dto/register-account.dto';
import { RegisterCustomerDTO } from './dto/register-customer.dto';
import { RegisterKitchenDTO } from './dto/register-kitchen.dto';
import { RegisterShipperDTO } from './dto/register-shipper.dto';
// import { VerifySignUp } from './dto/verify-signup.dto';
// import { VerifySignUp } from './dto/verify-signup.dto';
import { Payload } from './payload';
import { LoginResponseDto } from './response/login-response.dto';
import { RefreshTokenResponseDTO } from './response/refresh-token-response.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
    private readonly profileService: ProfileService,
    private readonly rolesService: RolesService,
    private readonly shipperService: ShippersService,
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
    private readonly kitchenService: KitchenService,
    private readonly sharedService: SharedService, // private readonly mailService: MailService,
  ) {}

  async signUpCustomer(register: RegisterCustomerDTO): Promise<AccountEntity> {
    const account = await this.accountsService.findOne({
      where: { phone: register.phone },
    });
    if (account) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
    const emailFind = await this.profileService.findOne({
      where: { email: register.email },
    });
    if (emailFind) {
      throw new HttpException('Email existed', HttpStatus.BAD_REQUEST);
    }
    register.password = await bcrypt.hash(register.password, 10);
    const callback = async (entityManager: EntityManager): Promise<void> => {
      // const otp = this.sharedService.generateOtp();

      // await this.mailService.sendUserConfirmation(
      //   register.firstName.toLocaleUpperCase() +
      //     ' ' +
      //     register.lastName.toLocaleUpperCase(),
      //   register.email,
      //   otp,
      // );

      const role = await entityManager.findOne(RoleEntity, {
        where: { name: RoleEnum.CUSTOMER },
      });

      const accountEntity = await entityManager.save(
        AccountEntity,
        entityManager.create(AccountEntity, {
          // phone: register.phone,
          // password: register.password,
          ...register,
          role,
          // codeVerify: 1111,
          // dateExpiredVerifyCode: new Date(),
        }),
      );

      // await entityManager.save(
      //   CustomerEntity,
      //   entityManager.create(CustomerEntity, {
      //     id: accountEntity.id,
      //     address: register.address,
      //   }),
      // );

      await entityManager.save(
        ProfileEntity,
        entityManager.create(ProfileEntity, {
          account: accountEntity,
          avatar:
            'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
          ...register,
        }),
      );
    };

    await this.accountsService.transaction(callback, this.dataSource);

    return this.accountsService.findOne({
      relations: { role: true, profile: true },
      where: { phone: register.phone },
    });
  }

  // async verifySignUp(dto: VerifySignUp): Promise<string> {
  //   const { phone, otp } = dto;
  //   const user = await this.accountsService.findOne({
  //     where: { phone: phone },
  //   });
  //   if (!user) {
  //     throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
  //   }
  //   this.sharedService.verifyOTPSignUp(
  //     +otp,
  //     user.codeVerify,
  //     user.dateExpiredVerifyCode,
  //   );
  //   await this.accountsService.updateConfirmVerifyStatusAccount(user.id);
  //   return 'Verify OTP Successfully';
  // }

  async registerShipper(register: RegisterShipperDTO): Promise<AccountEntity> {
    const account = await this.accountsService.findOne({
      where: { phone: register.phone },
    });
    if (Boolean(account)) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
    const checkEmail = await this.profileService.findOne({
      where: { email: register.email },
    });
    if (Boolean(checkEmail)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const checkNoPlate = await this.shipperService.findOne({
      where: { noPlate: register.noPlate },
    });
    if (Boolean(checkNoPlate)) {
      throw new HttpException('noPlate already exists', HttpStatus.BAD_REQUEST);
    }

    const kitchenFind = await this.kitchenService.findOne({
      where: { id: register.kitchenId },
    });
    if (!kitchenFind || kitchenFind == null)
      throw new HttpException('Kitchen not found', HttpStatus.NOT_FOUND);

    register.password = await bcrypt.hash(register.password, 10);
    const callback = async (entityManager: EntityManager): Promise<void> => {
      const role = await entityManager.findOne(RoleEntity, {
        where: { name: RoleEnum.SHIPPER },
      });

      const accountEntity = await entityManager.save(
        AccountEntity,
        entityManager.create(AccountEntity, {
          phone: register.phone,
          password: register.password,
          status: StatusEnum.ACTIVE,
          role,
        }),
      );

      await entityManager.save(
        ShipperEntity,
        entityManager.create(ShipperEntity, {
          id: accountEntity.id,
          noPlate: register.noPlate,
          vehicleType: register.vehicleType,
          status: ShipperStatusEnum.ACTIVE,
          kitchen: kitchenFind,
        }),
      );

      await entityManager.save(
        ProfileEntity,
        entityManager.create(ProfileEntity, {
          account: accountEntity,
          avatar:
            'https://firebasestorage.googleapis.com/v0/b/meal-subcription-plan.appspot.com/o/default_avatar.png?alt=media&token=5623e4d3-4139-4fb8-abd0-eea54c02cc83',
          ...register,
        }),
      );
    };

    await this.accountsService.transaction(callback, this.dataSource);

    return this.accountsService.findOne({
      relations: { role: true, shipper: true, kitchen: true },
      where: { phone: register.phone },
    });
  }

  async registerKitchen(register: RegisterKitchenDTO): Promise<AccountEntity> {
    const account = await this.accountsService.findOne({
      where: { phone: register.phone },
    });
    if (Boolean(account)) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
    const checkEmail = await this.profileService.findOne({
      where: { email: register.email },
    });
    if (Boolean(checkEmail)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    register.password = await bcrypt.hash(register.password, 10);
    const callback = async (entityManager: EntityManager): Promise<void> => {
      const role = await entityManager.findOne(RoleEntity, {
        where: { name: RoleEnum.KITCHEN },
      });

      const accountEntity = await entityManager.save(
        AccountEntity,
        entityManager.create(AccountEntity, {
          phone: register.phone,
          password: register.password,
          status: StatusEnum.ACTIVE,
          role,
        }),
      );

      await entityManager.save(
        KitchenEntity,
        entityManager.create(KitchenEntity, {
          id: accountEntity.id,
          address: register.address,
          openTime: register.openTime,
          closeTime: register.closeTime,
          openingDate: register.openingDate,
        }),
      );

      await entityManager.save(
        ProfileEntity,
        entityManager.create(ProfileEntity, {
          account: accountEntity,
          ...register,
        }),
      );
    };

    await this.accountsService.transaction(callback, this.dataSource);

    return this.accountsService.findOne({
      relations: { role: true, kitchen: true },
      where: { phone: register.phone },
    });
  }

  async checkPhoneExist(dto: CheckPhoneDTO): Promise<LoginResponseDto> {
    const { phone } = dto;
    const user = await this.accountsService.findOne({
      relations: { role: true },
      where: { phone },
    });

    if (!user)
      throw new HttpException('Phone not exist', HttpStatus.BAD_REQUEST);
    if (user.status != StatusEnum.ACTIVE) {
      throw new HttpException(
        'This phone do not active',
        HttpStatus.BAD_REQUEST,
      );
    }
    // const isCorrectPassword = await bcrypt.compare(pa user.password);
    // if (!isCorrectPassword)
    // throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    // const payload: Payload = { phone, role };
    const role = user.role.name;
    const payload: Payload = { phone, role };
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.jwtConfigService.refreshTokenSecret,
        expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
      },
    );
    await this.accountsService.updateRefreshToken(refreshToken, user.id);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
      refresh_token: refreshToken,
    };
  }

  async checkPhoneShipperExist(dto: CheckPhoneDTO): Promise<LoginResponseDto> {
    const { phone } = dto;
    const user = await this.accountsService.findOne({
      relations: { role: true },
      where: { phone, role: { name: RoleEnum.SHIPPER } },
    });

    if (!user)
      throw new HttpException('Phone not exist', HttpStatus.BAD_REQUEST);
    if (user.status != StatusEnum.ACTIVE) {
      throw new HttpException(
        'This phone do not active',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = user.role.name;
    const payload: Payload = { phone, role };
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.jwtConfigService.refreshTokenSecret,
        expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
      },
    );
    await this.accountsService.updateRefreshToken(refreshToken, user.id);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
      refresh_token: refreshToken,
    };
  }

  async checkPhoneCustomerExist(dto: CheckPhoneDTO): Promise<LoginResponseDto> {
    const { phone } = dto;
    const user = await this.accountsService.findOne({
      relations: { role: true },
      where: { phone, role: { name: RoleEnum.CUSTOMER } },
    });

    if (!user)
      throw new HttpException('Phone not exist', HttpStatus.BAD_REQUEST);
    if (user.status != StatusEnum.ACTIVE) {
      throw new HttpException(
        'This phone do not active',
        HttpStatus.BAD_REQUEST,
      );
    }
    const role = user.role.name;
    const payload: Payload = { phone, role };
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.jwtConfigService.refreshTokenSecret,
        expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
      },
    );
    await this.accountsService.updateRefreshToken(refreshToken, user.id);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
      refresh_token: refreshToken,
    };
  }

  async loginAll(dto: LoginDto): Promise<LoginResponseDto> {
    const { phone, password } = dto;
    const user = await this.accountsService.findOne({
      relations: { role: true },
      where: { phone, status: StatusEnum.ACTIVE },
    });

    if (!user)
      throw new HttpException('Account invalid', HttpStatus.BAD_REQUEST);
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    // const payload: Payload = { phone, role };
    const role = user.role.name;
    const payload: Payload = { phone, role };
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.jwtConfigService.refreshTokenSecret,
        expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
      },
    );
    await this.accountsService.updateRefreshToken(refreshToken, user.id);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
      refresh_token: refreshToken,
    };
  }

  async login(dto: LoginDto, role: RoleEnum): Promise<LoginResponseDto> {
    const { phone, password } = dto;
    const user = await this.accountsService.findOne({
      relations: { role: true },
      where: { phone, role: { name: role }, status: StatusEnum.ACTIVE },
    });

    if (!user)
      throw new HttpException('Account invalid', HttpStatus.BAD_REQUEST);
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    const payload: Payload = { phone, role };
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.jwtConfigService.refreshTokenSecret,
        expiresIn: this.jwtConfigService.refreshTokenExpiresIn,
      },
    );
    await this.accountsService.updateRefreshToken(refreshToken, user.id);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    const { id } = (await this.jwtService.verify(refreshToken, {
      secret: this.jwtConfigService.refreshTokenSecret,
      ignoreExpiration: false,
    })) as { id: string };
    const user = await this.accountsService.findOne({
      where: { id: id },
      relations: {
        role: true,
      },
    });
    if (!user || user.refreshToken != refreshToken) {
      throw new HttpException('Token invalid', HttpStatus.BAD_REQUEST);
    }
    const payload: Payload = { phone: user.phone, role: user.role.name };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.jwtConfigService.accessTokenSecret,
        expiresIn: this.jwtConfigService.accessTokenExpiresIn,
      }),
    };
  }

  async logout(user: AccountEntity): Promise<string> {
    const result = await this.accountsService.updateRefreshToken(null, user.id);
    return result.affected == 1 ? 'logout success' : 'logout failure';
  }

  async signUpAdmin(register: RegisterAccountDTO): Promise<AccountEntity> {
    const account = await this.accountsService.findOne({
      where: { phone: register.phone },
    });
    if (account) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
    const email = await this.profileService.findOne({
      where: { email: register.email },
    });
    if (email) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    register.password = await bcrypt.hash(register.password, 10);
    const callback = async (entityManager: EntityManager): Promise<void> => {
      const role = await entityManager.findOne(RoleEntity, {
        where: { name: RoleEnum.ADMIN },
      });
      const accountEntity = await entityManager.save(
        AccountEntity,
        entityManager.create(AccountEntity, {
          ...register,
          role,
        }),
      );
      await entityManager.save(
        ProfileEntity,
        entityManager.create(ProfileEntity, {
          account: accountEntity,
          ...register,
        }),
      );
    };
    await this.accountsService.transaction(callback, this.dataSource);
    return this.accountsService.findOne({
      relations: { role: true, profile: true },
      where: { phone: register.phone },
    });
  }

  async signUpManager(register: RegisterAccountDTO): Promise<AccountEntity> {
    const account = await this.accountsService.findOne({
      where: { phone: register.phone },
    });
    if (account) {
      throw new HttpException('Account already exists', HttpStatus.BAD_REQUEST);
    }
    const email = await this.profileService.findOne({
      where: { email: register.email },
    });
    if (email) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    register.password = await bcrypt.hash(register.password, 10);
    const callback = async (entityManager: EntityManager): Promise<void> => {
      const role = await entityManager.findOne(RoleEntity, {
        where: { name: RoleEnum.MANAGER },
      });
      const accountEntity = await entityManager.save(
        AccountEntity,
        entityManager.create(AccountEntity, {
          ...register,
          role,
        }),
      );
      await entityManager.save(
        ProfileEntity,
        entityManager.create(ProfileEntity, {
          account: accountEntity,
          ...register,
        }),
      );
    };
    await this.accountsService.transaction(callback, this.dataSource);
    return this.accountsService.findOne({
      relations: { role: true, profile: true },
      where: { phone: register.phone },
    });
  }
}
