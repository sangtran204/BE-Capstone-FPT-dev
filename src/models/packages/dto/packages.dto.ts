import { AutoMap } from '@automapper/classes';
import { PackageCategoryDTO } from 'src/models/package-categories/dto/package-category.dto';
import { PackageItemDTO } from 'src/models/package-item/dto/package-item.dto';
import { TimeFrameDTO } from 'src/models/time-frame/dto/time-frame.dto';
import { BaseDTO } from '../../base/base.dto';

export class PackageDTO extends BaseDTO {
  @AutoMap()
  startSale: Date;

  @AutoMap()
  endSale: Date;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  price: number;

  @AutoMap()
  image: string;

  @AutoMap()
  totalDate: number;

  @AutoMap()
  totalMeal: number;

  @AutoMap()
  totalFood: number;

  @AutoMap()
  totalStation: number;

  @AutoMap()
  status: string;

  @AutoMap(() => TimeFrameDTO)
  timeFrame: TimeFrameDTO;

  @AutoMap(() => PackageCategoryDTO)
  packageCategory: PackageCategoryDTO;

  @AutoMap(() => PackageItemDTO)
  packageItem: PackageItemDTO;
}
