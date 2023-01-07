import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Controller,
  Query,
} from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchEntity } from './entities/batch.entity';
import { Public } from 'src/decorators/public.decorator';
@ApiBearerAuth()
@ApiTags('batch')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  // @Post()
  // @Public()
  // @ApiResponse({
  //   status: 200,
  //   description: 'CREATE BATCH',
  //   type: BatchEntity,
  // })
  // async createBatch(): Promise<BatchEntity> {
  //   return await this.batchService.createBatch();
  // }
  @Get('/byId/:id')
  @ApiResponse({
    status: 200,
    description: 'GET BATCH BY ID',
    type: BatchEntity,
  })
  async getBatchById(@Param('id') id: string): Promise<BatchEntity> {
    return await this.batchService.getBatchById(id);
  }

  @Put('/update_status/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'UPDATE STATUS BATCH BY ID',
    type: String,
  })
  async updateStatusBatch(@Param('id') id: string): Promise<string> {
    return await this.batchService.updateStatusBatch(id);
  }
}
