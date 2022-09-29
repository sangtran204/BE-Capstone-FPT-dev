import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TimeSlotEntity } from './entities/time-slots.entity';
import { TimeSlotsController } from './time-slots.controller';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlotProfile } from './profile/timeSlot.profile';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlotEntity])],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService, TimeSlotProfile],
  exports: [TimeSlotsService],
})
export class TimeSlotsModule {}
