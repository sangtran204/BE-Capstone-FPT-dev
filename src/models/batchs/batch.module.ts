import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/order.module';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { BatchEntity } from './entities/batch.entity';
import { BatchProfile } from './profile/batch.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchEntity]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [BatchController],
  providers: [BatchService, BatchProfile],
  exports: [BatchService],
})
export class BatchModule {}
