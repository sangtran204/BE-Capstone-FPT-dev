import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../base/base.dto';

export class PackageDTO extends BaseDTO {
  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  @IsInt()
  totalGroupItem: number;

  @IsNotEmpty()
  @ApiProperty()
  @AutoMap()
  price: number;
}
