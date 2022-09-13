import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty()
  @AutoMap()
  images: string;

  @ApiProperty({ type: String, description: 'Food category' })
  @AutoMap()
  foodCategoryId: string;

  // @ApiProperty({
  //   type: [UrlImageDto],
  //   description: 'List image food',
  //   default: [
  //     {
  //       url: 'https://cdn5.vectorstock.com/i/1000x1000/05/24/healthy-food-banner-template-design-vector-32100524.jpg',
  //     },
  //     {
  //       url: 'https://cdn5.vectorstock.com/i/1000x1000/05/24/healthy-food-banner-template-design-vector-32100524.jpg',
  //     },
  //   ],
  // })
  // @AutoMap(() => [UrlImageDto])
  // images: [UrlImageDto];

  // @AutoMap(() => [UrlImageDto])
  // images: UrlImageDto[];
}
