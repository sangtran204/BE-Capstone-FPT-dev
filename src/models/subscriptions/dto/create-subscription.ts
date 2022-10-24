import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubscriptionDTO {
  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  startDelivery: Date;

  @ApiProperty()
  @IsUUID()
  packageId: string;
}
