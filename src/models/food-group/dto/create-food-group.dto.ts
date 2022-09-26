import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFoodGroupDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  totalFood: number;

  @ApiProperty({ type: [String] })
  @IsUUID(null, { each: true, message: 'ID food must be unique' })
  foodIds: string[];
}
