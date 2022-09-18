import { ApiProperty } from '@nestjs/swagger';
// import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFoodGroupDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  totalFood: number;

  @ApiProperty({ type: String, format: 'binary' })
  image: object;
}
