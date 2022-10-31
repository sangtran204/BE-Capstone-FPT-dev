import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FeedBackService } from './feedback.service';

@ApiBearerAuth()
@ApiTags('feedback')
@Controller('feedback')
export class FeedBackController {
  constructor(private readonly feedbackService: FeedBackService) {}
}
