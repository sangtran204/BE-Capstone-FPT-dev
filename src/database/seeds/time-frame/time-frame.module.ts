import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TimeFrameEntity } from 'src/models/time-frame/entities/time-frame.entity';
import { TimeFrameSeederService } from './time-frame.service';
@Module({
  imports: [TypeOrmModule.forFeature([TimeFrameEntity])],
  providers: [TimeFrameSeederService],
  exports: [TimeFrameSeederService],
})
export class TimeFrameSeederModule {}
