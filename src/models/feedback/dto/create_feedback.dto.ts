import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDTO {
  @ApiProperty()
  packageRate: number;

  @ApiProperty()
  foodRate: number;

  @ApiProperty()
  deliveryRate: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  packageId: string;
}
