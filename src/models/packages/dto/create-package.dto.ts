import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePackageDTO {
  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  startSale: Date;

  @ApiProperty({ default: new Date().toISOString().slice(0, 10) })
  endSale: Date;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ type: String, format: 'binary' })
  image: object;

  @ApiProperty()
  @IsNotEmpty()
  totalDate: number;

  @ApiProperty()
  @IsNotEmpty()
  totalMeal: number;

  @ApiProperty()
  @IsNotEmpty()
  totalFood: number;

  @ApiProperty()
  @IsNotEmpty()
  totalStation: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  timeFrameID: string;
}
