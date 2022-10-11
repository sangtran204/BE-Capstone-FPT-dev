import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateSubscriptionDTO {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsUUID()
  packageId: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  startDelivery: Date;
}
