import { ApiProperty } from '@nestjs/swagger';
import { InActiveEnum } from 'src/common/enums/active.enum';
import { StatusEnum } from 'src/common/enums/status.enum';

export class FoodFilterDTO {
  @ApiProperty({
    enum: InActiveEnum,
    required: false,
    description: 'Food status',
    default: StatusEnum.ACTIVE,
  })
  statusFood: InActiveEnum;
}

export class FoodFilter {
  @ApiProperty()
  categoryId: string;

  @ApiProperty({
    enum: InActiveEnum,
    required: false,
    description: 'Food status',
    default: StatusEnum.ACTIVE,
  })
  status: InActiveEnum;
}
