import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { boolean } from 'joi';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { TimeSlotsService } from './timeSlots.service';
import { TimeSlotDTO } from './dto/timeSlot.dto';
import { TimeSlotEntity } from './entities/timeSlots.entity';

@ApiBearerAuth()
@ApiTags('timeSlots')
@Controller('timeSlots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  //List all timeSlot
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL TIME SLOT',
    type: [TimeSlotDTO],
  })
  @UseInterceptors(
    MapInterceptor(TimeSlotEntity, TimeSlotDTO, {
      isArray: true,
    }),
  )
  async findAll(): Promise<TimeSlotEntity[] | string> {
    const listTimeSlots = await this.timeSlotsService.getAllTimeSlot();
    if (listTimeSlots.length == 0) {
      return 'No Time Slot found';
    } else {
      return listTimeSlots;
    }
  }
  //List time slot follow flag
  @Public()
  @Get('/:flag')
  @ApiResponse({
    status: 200,
    description: 'GET ALL TIME SLOT FOLLOW FLAG',
    type: [TimeSlotDTO],
  })
  @UseInterceptors(
    MapInterceptor(TimeSlotEntity, TimeSlotDTO, {
      isArray: true,
    }),
  )
  async getTimeSlotFlag(
    @Param('flag') flag: number,
  ): Promise<TimeSlotEntity[] | string> {
    const listTimeSlotFlag = await this.timeSlotsService.getTimeSlotFlag(flag);
    if (listTimeSlotFlag != null) {
      return listTimeSlotFlag;
    } else {
      return 'No data time slot';
    }
  }

  //Create time slot
  @Public()
  @Post()
  @ApiResponse({
    status: 200,
    description: 'CREATE TIME SLOT',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(TimeSlotEntity, TimeSlotDTO))
  async createTimeSlot(
    @Body() dto: TimeSlotDTO,
  ): Promise<TimeSlotEntity | string> {
    if (await this.timeSlotsService.createTimeSlot(dto)) {
      return 'Create time slot successfull';
    } else {
      return 'Create time slot fail';
    }
  }

  //Delete time slot
  @Public()
  @Delete('/:id')
  @ApiResponse({
    status: 200,
    description: 'DELETE TIME SLOT',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(TimeSlotEntity, TimeSlotDTO))
  async deleteTimeSlot(@Param('id') id: string): Promise<string> {
    if (await this.timeSlotsService.deleteTimeSlot(id)) {
      return 'Delete successfull';
    } else {
      return 'Delete fail';
    }
  }

  @Public()
  @Post('/:id')
  @ApiResponse({
    status: 200,
    description: 'UPDATE TIME SLOT',
    type: boolean,
  })
  @UseInterceptors(MapInterceptor(TimeSlotEntity, TimeSlotDTO))
  async updateTimeSlot(
    @Param('id') id: string,
    @Body() dto: TimeSlotDTO,
  ): Promise<string> {
    if (await this.timeSlotsService.updateTimeSlot(id, dto)) {
      return 'Update successfull';
    } else {
      return 'Update fail';
    }
  }
}
