import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../base/base.dto';

export class TimeSlotDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  startTime: string;

  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  endTime: string;

  @ApiProperty()
  @AutoMap()
  flag: number;
}
