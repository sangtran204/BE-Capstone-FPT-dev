import { ApiProperty } from '@nestjs/swagger';
export class UpdateAvatarDTO {
  @ApiProperty({ type: String, format: 'binary' })
  avatar: object;
}
