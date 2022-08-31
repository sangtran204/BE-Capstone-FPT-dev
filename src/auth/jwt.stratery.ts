// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { JwtConfigService } from 'src/config/jwt/config.service';
// import { AccountsService } from 'src/models/accounts/accounts.service';
// import { AccountEntity } from 'src/models/accounts/entities/account.entity';
// import { Payload } from './payload';

// @Injectable()
// export class JwtStratery extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly jwtConfigService: JwtConfigService,
//     private readonly accountsServive: AccountsService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConfigService.accessTokenSecret,
//     });
//   }

//   async validate(payload: Payload): Promise<AccountEntity> {
//     const { username } = payload;

//     return this.accountsServive.findOne({
//       relations: { role: true, customer: true },
//       where: { username },
//     });
//   }
// }
