import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { BatchEntity } from './entities/batch.entity';
import { BatchProfile } from './profile/batch.profile';

@Module({
  imports: [TypeOrmModule.forFeature([BatchEntity])],
  controllers: [BatchController],
  providers: [BatchService, BatchProfile],
  exports: [BatchService],
})
export class BatchModule {}
