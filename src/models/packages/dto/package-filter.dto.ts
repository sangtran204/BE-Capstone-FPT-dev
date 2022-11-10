import { ApiProperty } from '@nestjs/swagger';
import { InActiveEnum } from 'src/common/enums/active.enum';

export class PackageFilterDTO {
  @ApiProperty({
    enum: InActiveEnum,
    required: false,
    description: 'Package status',
    default: InActiveEnum.ACTIVE,
  })
  statusPackage: InActiveEnum;
}
