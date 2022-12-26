import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchenModule } from '../kitchens/kitchens.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { SessionEntity } from './entities/sessions.entity';
import { SessionProfile } from './profile/sessions.profile';
import { SessionControler } from './sessions.controller';
import { SessionService } from './sessions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity]),
    KitchenModule,
    TimeSlotsModule,
  ],
  controllers: [SessionControler],
  providers: [SessionService, SessionProfile],
  exports: [SessionService],
})
export class SessionModule {}
