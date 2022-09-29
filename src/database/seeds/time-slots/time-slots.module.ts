import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TimeSlotEntity } from 'src/models/time-slots/entities/time-slots.entity';
import { TimeSlotsSeederService } from './time-slots.service';
@Module({
  imports: [TypeOrmModule.forFeature([TimeSlotEntity])],
  providers: [TimeSlotsSeederService],
  exports: [TimeSlotsSeederService],
})
export class TimeSlotsSeederModule {}
