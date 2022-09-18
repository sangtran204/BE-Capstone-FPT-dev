import { ApiProperty } from '@nestjs/swagger';

export class CreateFoodDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: String })
  foodCategoryId: string;

  @ApiProperty({ type: String, format: 'binary' })
  image: object;
}
