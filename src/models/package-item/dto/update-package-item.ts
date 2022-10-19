import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePackageItemDTO {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  foodGroupID: string;
}
