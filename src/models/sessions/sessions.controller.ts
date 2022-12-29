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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CreateSessionDTO } from './dto/createSession.dto';
import { SessionEntity } from './entities/sessions.entity';
import { SessionService } from './sessions.service';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
export class SessionControler {
  constructor(private readonly sessionService: SessionService) {}

  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE SESSION',
    type: SessionEntity,
  })
  async createSession(@Query() dto: CreateSessionDTO): Promise<SessionEntity> {
    return await this.sessionService.createSession(dto);
  }
}
