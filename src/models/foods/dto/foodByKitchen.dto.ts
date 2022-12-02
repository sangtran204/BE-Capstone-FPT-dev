import { AutoMap } from '@automapper/classes';

export class FoodByKitchenDTO {
  @AutoMap()
  foodImg: string;

  @AutoMap()
  foodId: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  flag: number;

  @AutoMap()
  quantity: number;

  @AutoMap()
  deliveryDate: Date;
}
