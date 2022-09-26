import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeFrameEntity } from './entities/time-frame.entity';
import { TimeFrameProfile } from './profile/time-frame.profile';
import { TimeFrameController } from './time-frame.controller';
import { TimeFrameService } from './time-frame.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeFrameEntity])],
  controllers: [TimeFrameController],
  providers: [TimeFrameService, TimeFrameProfile],
  exports: [TimeFrameService],
})
export class TimeFrameModule {}
