import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedBackEntity } from './entities/feedback.entity';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';
import { FeedBackProfile } from './profile/feedback.profile';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackEntity])],
  controllers: [FeedBackController],
  providers: [FeedBackService, FeedBackProfile],
  exports: [FeedBackService],
})
export class FeedBackModule {}
