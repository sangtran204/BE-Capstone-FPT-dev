import { ApiProperty } from '@nestjs/swagger';
import { InActiveEnum } from 'src/common/enums/active.enum';

export class FoodGroupFilterDTO {
  @ApiProperty({
    enum: InActiveEnum,
    required: false,
    description: 'Food Group status',
    default: InActiveEnum.ACTIVE,
  })
  statusFG: InActiveEnum;
}
