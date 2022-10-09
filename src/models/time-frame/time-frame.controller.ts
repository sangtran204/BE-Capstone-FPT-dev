import { MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Get,
  Delete,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateFrameDTO } from './dto/create-frame.dto';
import { TimeFrameDTO } from './dto/time-frame.dto';
import { UpdateTimeFrameDTO } from './dto/update-frame.dto';
import { TimeFrameEntity } from './entities/time-frame.entity';
import { TimeFrameService } from './time-frame.service';

@ApiBearerAuth()
@ApiTags('time-frame')
@Controller('time-frame')
export class TimeFrameController {
  constructor(private readonly timeFrameService: TimeFrameService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL Time Frame',
    type: [TimeFrameDTO],
  })
  @UseInterceptors(
    MapInterceptor(TimeFrameEntity, TimeFrameDTO, { isArray: true }),
  )
  async getAll(): Promise<TimeFrameEntity[]> {
    const list = await this.timeFrameService.query();
    if (!list || list.length == 0) {
      throw new HttpException(
        "Don't have resource time-frame",
        HttpStatus.NOT_FOUND,
      );
    } else {
      return list;
    }
  }

  @Public()
  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET Time Frame',
    type: TimeFrameDTO,
  })
  @UseInterceptors(MapInterceptor(TimeFrameEntity, TimeFrameDTO))
  async getById(@Param('id') id: string): Promise<TimeFrameEntity> {
    const frame = await this.timeFrameService.findOne({ where: { id: id } });
    if (!frame) {
      throw new HttpException(
        "Don't have resource time-frame",
        HttpStatus.NOT_FOUND,
      );
    } else {
      return frame;
    }
  }

  @Post()
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Created new frame successfully',
    type: String,
  })
  async createTimeFrame(@Body() createFrame: CreateFrameDTO): Promise<string> {
    const frame = await this.timeFrameService.save({
      name: createFrame.name,
      dateFilter: createFrame.dateFilter,
    });
    if (!frame) {
      throw new HttpException('Create fail', HttpStatus.BAD_REQUEST);
    }
    return 'Create new frame successfully';
  }

  @Put('/:id')
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Update frame successfully',
    type: String,
  })
  async updateTimeFrame(
    @Param('id') id: string,
    @Body() updateFrame: UpdateTimeFrameDTO,
  ): Promise<string> {
    return await this.timeFrameService.updateTimeFrame(id, updateFrame);
  }

  @Delete('/:id')
  @Roles(RoleEnum.MANAGER)
  @ApiResponse({
    status: 200,
    description: 'Delete frame successfully',
    type: String,
  })
  async deleteTimeFrame(@Param('id') id: string): Promise<string> {
    return await this.timeFrameService.deleteTimeFrame(id);
  }
}
