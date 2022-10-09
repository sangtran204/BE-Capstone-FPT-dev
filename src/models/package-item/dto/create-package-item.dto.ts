import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class CreatePackageItemDTO {
  @ApiProperty()
  deliveryDate: Date;

  @ApiProperty()
  totalGroup: number;

  @ApiProperty()
  @Max(10)
  @Min(1)
  maxFood: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  packageID: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  timeFrameID: string;

  @ApiProperty({ type: [String] })
  @IsUUID(null, { each: true, message: 'ID FoodGroup must be unique' })
  foodGroupIds: string[];
}
