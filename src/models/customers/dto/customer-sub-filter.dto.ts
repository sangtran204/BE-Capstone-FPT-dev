import { ApiProperty } from '@nestjs/swagger';
import { SubEnum } from 'src/common/enums/sub.enum';

export class SubFilter {
  @ApiProperty({
    enum: SubEnum,
    required: false,
    description: 'Subsciption status',
    default: SubEnum.INPROGRESS,
  })
  status: SubEnum;
}
