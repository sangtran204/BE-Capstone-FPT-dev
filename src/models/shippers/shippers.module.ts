import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from '../accounts/accounts.module';
import { KitchenModule } from '../kitchens/kitchens.module';
import { ProfileModule } from '../profiles/profile.module';
import { ShipperEntity } from './entities/shipper.entity';
import { ShipperProfile } from './profile/shipper.profile';
import { ShippersController } from './shippers.controller';
import { ShippersService } from './shippers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipperEntity]),
    AccountsModule,
    ProfileModule,
    KitchenModule,
  ],
  controllers: [ShippersController],
  providers: [ShippersService, ShipperProfile],
  exports: [ShippersService],
})
export class ShippersModule {}
