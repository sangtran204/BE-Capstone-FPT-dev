import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
@ApiBearerAuth()
@ApiTags('batch')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}
}
