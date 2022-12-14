import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedBackEntity } from './entities/feedback.entity';
import { FeedBackController } from './feedback.controller';
import { FeedBackService } from './feedback.service';
import { FeedBackProfile } from './profile/feedback.profile';
import { PackagesModule } from '../packages/packages.module';
import { SubscriptionModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedBackEntity]),
    PackagesModule,
    SubscriptionModule,
  ],
  controllers: [FeedBackController],
  providers: [FeedBackService, FeedBackProfile],
  exports: [FeedBackService],
})
export class FeedBackModule {}
