import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { TimeFrameEntity } from './entities/time-frame.entity';
import { TimeFrameService } from './time-frame.service';

@ApiBearerAuth()
@ApiTags('time-frame')
@Controller('time-frame')
export class TimeFrameController {
  constructor(private readonly timeFrameService: TimeFrameService) {}

  //Get all Time Frame.
  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL Time Frame',
    type: [TimeFrameEntity],
  })
  async getAll(): Promise<TimeFrameEntity[]> {
    const list = await this.timeFrameService.getAll();
    if (!list || list.length == 0) {
      throw new HttpException("Don't have resource", HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }
}
