import { Controller } from '@nestjs/common';
import { ShippersService } from './shippers.service';

@Controller('shippers')
export class ShippersController {
  constructor(private readonly shippersService: ShippersService) {}
}
