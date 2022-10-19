import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubscriptionDTO {
  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ default: new Date() })
  startDelivery: Date;

  @ApiProperty()
  @IsUUID()
  packageId: string;
}
