import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../base/base.dto';

export class MealDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  dateOfMeal: string;

  @ApiProperty()
  @AutoMap()
  timeSlotId: string;
}
