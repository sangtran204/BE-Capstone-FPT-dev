import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FoodDTO } from './food.dto';

export class CreateFoodDTO extends FoodDTO {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'food_category' })
  foodCategoryId: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: object;
}
