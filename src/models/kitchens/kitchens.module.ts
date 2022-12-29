import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { KitchenService } from './kitchens.service';
import { KitchenController } from './kitchens.controller';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenProfile } from './profile/kitchens.profile';
import { ProfileModule } from '../profiles/profile.module';
import { AccountsModule } from '../accounts/accounts.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([KitchenEntity]),
    ProfileModule,
    AccountsModule,
  ],
  controllers: [KitchenController],
  providers: [KitchenService, KitchenProfile],
  exports: [KitchenService],
})
export class KitchenModule {}
