import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchenModule } from '../kitchens/kitchens.module';
import { ShipperEntity } from './entities/shipper.entity';
import { ShipperProfile } from './profile/shipper.profile';
import { ShippersController } from './shippers.controller';
import { ShippersService } from './shippers.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShipperEntity]), KitchenModule],
  controllers: [ShippersController],
  providers: [ShippersService, ShipperProfile],
  exports: [ShippersService],
})
export class ShippersModule {}
