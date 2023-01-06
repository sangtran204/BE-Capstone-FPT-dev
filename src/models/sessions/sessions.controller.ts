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
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateSessionDTO } from './dto/createSession.dto';
import { SessionByDate } from './dto/session_filter.dto';
import { SessionEntity } from './entities/sessions.entity';
import { SessionService } from './sessions.service';

@ApiBearerAuth()
@ApiTags('sessions')
@Controller('sessions')
export class SessionControler {
  constructor(private readonly sessionService: SessionService) {}

  @Get('/byKitchen')
  @ApiResponse({
    status: 200,
    description: 'KITCHEN GET SESSION BY WORK DATE',
    type: [SessionEntity],
  })
  async kitchenGetSessionByDate(
    @GetUser() user: AccountEntity,
    @Query() filter: SessionByDate,
  ): Promise<SessionEntity[]> {
    return await this.sessionService.getAllSessionByKitchen(user, filter);
  }

  @Get('/detail/:id')
  @ApiResponse({
    status: 200,
    description: 'GET SESSION DETAIL',
    type: SessionEntity,
  })
  async getSessionDetail(@Param('id') id: string): Promise<SessionEntity> {
    return await this.sessionService.getSessionDetail(id);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE SESSION',
    type: SessionEntity,
  })
  async createSession(@Query() dto: CreateSessionDTO): Promise<SessionEntity> {
    return await this.sessionService.createSession(dto);
  }

  @Put('/done_session/:id')
  @Public()
  // @Roles(RoleEnum.KITCHEN)
  @ApiResponse({
    status: 200,
    description: 'DONE SESSION',
    type: SessionEntity,
  })
  async doneSession(@Param('id') id: string): Promise<SessionEntity> {
    return await this.sessionService.doneSession(id);
  }
}
