import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedBackEntity } from './entities/feedback.entity';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';
import { FeedBackProfile } from './profile/feedback.profile';
import { SubscriptionModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedBackEntity]), SubscriptionModule],
  controllers: [FeedBackController],
  providers: [FeedBackService, FeedBackProfile],
  exports: [FeedBackService],
})
export class FeedBackModule {}
