// import { Body, Controller, Post } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/decorators/public.decorator';
// import { GetUser } from 'src/decorators/user.decorator';
// import { AccountEntity } from 'src/models/accounts/entities/account.entity';
// import { AuthService } from './auth.service';
// import { GoogleTokenDto } from './dto/google-token.dto';
// import { LoginDto } from './dto/login.dto';
// import { RefreshTokenDTO } from './dto/refresh-token.dto';
// import { RegisterCustomerDto } from './dto/register-customer.dto';
// import { LoginResponseDto } from './response/login-response.dto';
// import { RefreshTokenResponseDTO } from './response/refresh-token-response.dto';

// @ApiBearerAuth()
// @Controller('auths')
// @ApiTags('auths')
// export class AuthenticationController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('sign-up/customer')
//   @Public()
//   async signUpCustomer(
//     @Body() dto: RegisterCustomerDto,
//   ): Promise<AccountEntity> {
//     return this.authService.signUpCustomer(dto);
//   }

//   @Post('logn-in/customer')
//   @Public()
//   async loginCustomer(@Body() dto: LoginDto): Promise<LoginResponseDto> {
//     return this.authService.loginCustomer(dto);
//   }

//   @Post('log-in/google')
//   @Public()
//   async loginGoogle(@Body() dto: GoogleTokenDto): Promise<LoginResponseDto> {
//     return await this.authService.loginGoogle(dto.token);
//   }

//   @Post('refreshToken')
//   @Public()
//   async refreshToken(
//     @Body() dto: RefreshTokenDTO,
//   ): Promise<RefreshTokenResponseDTO> {
//     return await this.authService.refreshToken(dto.refresh_token);
//   }

//   @Post('logout')
//   async logout(@GetUser() user: AccountEntity): Promise<string> {
//     return await this.authService.logout(user);
//   }
// }
