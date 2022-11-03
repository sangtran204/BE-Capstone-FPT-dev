import { ApiProperty } from '@nestjs/swagger';

export class RejectReqDTO {
  @ApiProperty()
  rejectReason: string;
}
