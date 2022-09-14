import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDTO {
  @ApiProperty()
  @AutoMap()
  isActive: string;
}
