import { AutoMap } from '@automapper/classes';

export class FoodDTO {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  image: string;
}
