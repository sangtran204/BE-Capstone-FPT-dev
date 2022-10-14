import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreatePackageItemDTO {
  @ApiProperty()
  @Max(18)
  @Min(1)
  itemCode: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  packageID: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  timeFrameID: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  foodGroupID: string;

  // @ApiProperty({ type: [String] })
  // @IsUUID(null, { each: true, message: 'ID FoodGroup must be unique' })
  // foodGroupIds: string[];
}
