import { Controller } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomerDTO } from './dto/customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { SubFilter } from './dto/customer-sub-filter.dto';
@ApiBearerAuth()
@Controller('customers')
@ApiTags('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('/view-subscription')
  @ApiResponse({
    status: 200,
    description: 'GET SUB OF CUSTOMER',
    type: CustomerDTO,
  })
  async getAllPackage(@GetUser() user: AccountEntity): Promise<CustomerEntity> {
    const list = await this.customersService.findOne({
      where: { id: user.customer.id },
      relations: { subscriptions: true },
    });
    if (!list) {
      throw new HttpException('Not found user', HttpStatus.NOT_FOUND);
    }
    return list;
  }

  @Get('/view-subscription/byStatus')
  @ApiResponse({
    status: 200,
    description: 'GET SUB OF CUSTOMER BY STATUS',
    type: CustomerDTO,
  })
  async getSubscriptionByStatus(
    @GetUser() user: AccountEntity,
    @Query() subFilter: SubFilter,
  ): Promise<CustomerEntity[]> {
    const list = await this.customersService.getSubByCustomer(user, subFilter);
    if (!list || list.length == 0) {
      throw new HttpException('No subscriptio found', HttpStatus.NOT_FOUND);
    }
    return list;
  }
}
