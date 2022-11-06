import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VnpayConfigService } from './config.service';
import configuration from './configuration';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        VNP_TMN_CODE: Joi.string().required(),
        VNP_HASH_SECRET: Joi.string().required(),
        VNP_URL: Joi.string().required(),
        VNP_RETURN_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService, VnpayConfigService],
  exports: [ConfigService, VnpayConfigService],
})
export class VnpayConfigModule {}
