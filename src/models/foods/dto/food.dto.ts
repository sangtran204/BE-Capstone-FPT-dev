import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { FoodCategoryDTO } from 'src/models/food-categories/dto/food-category.dto';
import { UrlImageDto } from 'src/models/images/dto/url-image.dto';
import { BaseDTO } from '../../base/base.dto';
export class FoodDTO extends BaseDTO {
  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  description: string;

  @ApiProperty()
  @AutoMap()
  price: number;

  @AutoMap(() => FoodCategoryDTO)
  foodCategory: FoodCategoryDTO;

  // @AutoMap(() => [UrlImageDto])
  // images: UrlImageDto[];
}
