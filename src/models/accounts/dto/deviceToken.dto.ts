import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from 'src/decorators/validations/IsNotEmptyString.decorator';

export class DeviceTokenDTO {
  @ApiProperty({
    type: String,
    description: 'Device token of user login',
    required: true,
  })
  @IsNotEmptyString()
  deviceToken: string;
}

export class CheckToken {
  @ApiProperty({
    type: String,
    description: 'Token check exist',
    required: true,
  })
  token: string;
}
