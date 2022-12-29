import { ApiProperty } from '@nestjs/swagger';
import { PackageEnum } from 'src/common/enums/package.enum';

export class PackageFilterDTO {
  @ApiProperty({
    enum: PackageEnum,
    required: false,
    description: 'Package status',
    default: PackageEnum.ACTIVE,
  })
  statusPackage: PackageEnum;
}
