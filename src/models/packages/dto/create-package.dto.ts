import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePackageDTO {
  @ApiProperty({ default: new Date() })
  startSale: Date;

  @ApiProperty({ default: new Date() })
  endSale: Date;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  price: number;

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

  @ApiProperty({ type: String })
  @IsNotEmpty()
  categoryID: string;
}
