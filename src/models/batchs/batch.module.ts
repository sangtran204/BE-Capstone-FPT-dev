import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { BatchProfile } from './profile/batch.profile';

@Module({
  imports: [TypeOrmModule.forFeature([BatchProfile])],
  controllers: [BatchController, BatchProfile],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
