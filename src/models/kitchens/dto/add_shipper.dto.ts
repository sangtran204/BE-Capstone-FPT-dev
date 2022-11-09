import { ApiProperty } from '@nestjs/swagger';

export class ShipperID {
  @ApiProperty({ type: String, description: 'ID Shipper' })
  idShipper: string;
}
export class ListShipperID {
  @ApiProperty({
    type: [ShipperID],
    description: 'List Shipper id',
  })
  shippers: [ShipperID];
}
