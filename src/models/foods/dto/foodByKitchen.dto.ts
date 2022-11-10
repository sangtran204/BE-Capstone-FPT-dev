import { AutoMap } from '@automapper/classes';

export class FoodByKitchenDTO {
  @AutoMap()
  name: string;

  // @AutoMap()
  // description: string;

  @AutoMap()
  flag: number;

  @AutoMap()
  quantity: number;
}
