import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { KitchenService } from './kitchens.service';
import { KitchenController } from './kitchens.controller';
import { KitchenEntity } from './entities/kitchens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KitchenEntity])],
  controllers: [KitchenController],
  providers: [KitchenService],
  exports: [KitchenService],
})
export class KitchenModule {}
