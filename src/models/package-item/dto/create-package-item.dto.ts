import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreatePackageItemDTO {
  @ApiProperty()
  @Max(2)
  @Min(0)
  itemCode: number;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  deliveryDate: Date;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  packageID: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  foodGroupID: string;
}
