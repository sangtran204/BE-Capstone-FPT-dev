import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchenModule } from '../kitchens/kitchens.module';
import { RequestEntity } from './entities/request.entity';
import { RequestProfile } from './profile/request.profile';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity]), KitchenModule],
  controllers: [RequestController],
  providers: [RequestService, RequestProfile],
  exports: [RequestService],
})
export class RequestModule {}
