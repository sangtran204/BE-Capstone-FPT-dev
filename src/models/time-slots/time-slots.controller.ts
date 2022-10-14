import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { TimeSlotsService } from './time-slots.service';
import { TimeSlotDTO } from './dto/time-slot.dto';
import { TimeSlotEntity } from './entities/time-slots.entity';
import { MapInterceptor } from '@automapper/nestjs';

@ApiBearerAuth()
@ApiTags('time-slots')
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  // @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL TIME SLOT',
    type: [TimeSlotDTO],
  })
  @UseInterceptors(
    MapInterceptor(TimeSlotEntity, TimeSlotDTO, { isArray: true }),
  )
  async findAll(): Promise<TimeSlotEntity[] | string> {
    const listTimeSlots = await this.timeSlotsService.query();
    if (!listTimeSlots || listTimeSlots.length == 0) {
      throw new HttpException('No data time slot', HttpStatus.NOT_FOUND);
    }
    return listTimeSlots;
  }

  // @Public()
  @Get('/:flag')
  @ApiResponse({
    status: 200,
    description: 'GET ALL TIME SLOT FOLLOW FLAG',
    type: [TimeSlotDTO],
  })
  @UseInterceptors(
    MapInterceptor(TimeSlotEntity, TimeSlotDTO, { isArray: true }),
  )
  async getTimeSlotFlag(
    @Param('flag') flag: number,
  ): Promise<TimeSlotEntity[]> {
    const listTimeSlotFlag = await this.timeSlotsService.query({
      where: { flag: flag },
    });
    if (!listTimeSlotFlag || listTimeSlotFlag.length == 0) {
      throw new HttpException(
        "Don't have resource Time-slot",
        HttpStatus.NOT_FOUND,
      );
    }
    return listTimeSlotFlag;
  }

  // @Public()
  @Get('find-by-id/:id')
  @ApiResponse({
    status: 200,
    description: 'GET TIME SLOT By ID',
    type: TimeSlotDTO,
  })
  @UseInterceptors(MapInterceptor(TimeSlotEntity, TimeSlotDTO))
  async finById(@Param('id') id: string): Promise<TimeSlotEntity> {
    const timeSlot = await this.timeSlotsService.findOne({
      where: { id: id },
    });
    if (!timeSlot) {
      throw new HttpException(
        "Don't have resource Time-slot",
        HttpStatus.NOT_FOUND,
      );
    }
    return timeSlot;
  }
}
