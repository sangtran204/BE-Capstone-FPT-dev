import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class OrderTourCreationDto {
  @ApiProperty()
  @IsUUID()
  customerID: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  packageID: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  startDelivery: Date;
}
