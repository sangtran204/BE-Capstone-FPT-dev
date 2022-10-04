// import { AccountEntity } from 'models/accounts/entities/account.entity';
// import { RoleEnum } from 'common/enums/role.enum';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Render,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { OrderTourCreationDto } from './dto/order-tour-creation.dto';
import { OrderEntity } from './entities/order.entity';
import { MapInterceptor } from '@automapper/nestjs';
import { OrderDTO } from './dto/order.dto';
import { IPaginate, paginate } from '../base/base.filter';
import { Request } from 'express';
// import { VnpayDto } from '../../providers/vnpay/vnpay.dto';
import { Public } from '../../decorators/public.decorator';
import { OrdersService } from './order.service';
import { OrderFilter } from './dto/order-filter.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { OrderTourCreationDto } from './dto/create-order.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';

@ApiBearerAuth()
@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(
    @Query() orderFilter: OrderFilter,
  ): Promise<IPaginate<OrderDTO>> {
    const data = await this.ordersService.findAll(orderFilter);
    return paginate<OrderDTO>(
      data,
      orderFilter.currentPage,
      orderFilter.sizePage,
    );
  }

  @Post()
  @Roles(RoleEnum.CUSTOMER)
  @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  async orderPackage(
    @Body() dto: OrderTourCreationDto,
    @GetUser() user: AccountEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.orderPackage(dto, user);
  }

  //   @Get('/:id/payment-url')
  //   async paymentUrl(
  //     @Req() req: Request,
  //     @GetUser() user: AccountEntity,
  //     @Param('id') id: string,
  //     @Query('bankId') bankId: string,
  //   ): Promise<string> {
  //     const ip =
  //       req.header('x-forwarded-for') ||
  //       req.connection.remoteAddress ||
  //       req.socket.remoteAddress;

  //     return this.ordersService.getPaymentUrl(ip, bankId, id);
  //   }

  //   @Get('/payment')
  //   @Public()
  //   @Render('index')
  //   async payment(@Query() vnpayDto: VnpayDto): Promise<{
  //     message: string;
  //     code: string;
  //     isSuccess: boolean;
  //   }> {
  //     try {
  //       const result = await this.ordersService.payment(vnpayDto);
  //       return result.code === '00'
  //         ? { ...result, isSuccess: true }
  //         : { ...result, isSuccess: false };
  //     } catch (error) {
  //       return error;
  //     }
  //   }

  //   @Get('/me')
  //   async getMyOrders(
  //     @GetUser() user: AccountEntity,
  //     @Query() queries: OrderFilterMe,
  //   ): Promise<IPaginate<OrderDto>> {
  //     const data = await this.ordersService.getMyOrders(user, queries);
  //     return paginate(data, queries.currentPage, queries.sizePage);
  //   }

  @Get('/:id')
  @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  async getOrderById(@Param('id') id: string): Promise<OrderEntity> {
    return await this.ordersService.findById(id);
  }

  @Put('/check-in/:id')
  @Roles(RoleEnum.CUSTOMER)
  @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  async checkIn(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.checkIn(id, user);
  }

  @Put('check-out/:id')
  @Roles(RoleEnum.CUSTOMER)
  @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  async checkOut(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<OrderEntity> {
    return this.ordersService.checkOut(id, user);
  }

  //   @Put('/tour-guide/confirm/:id')
  //   @ApiQuery({ name: 'Status', enum: [StatusEnum.REJECT, StatusEnum.ACCEPT] })
  //   @Roles(RoleEnum.TOUR_GUIDE)
  //   async tourGuideConfirmOrder(
  //     @Param('id') id: string,
  //     @GetUser() user: AccountEntity,
  //     @Query('Status')
  //     status: StatusEnum = StatusEnum.REJECT,
  //   ): Promise<string> {
  //     return await this.ordersService.tourGuideConfirmOrder(id, user, status);
  //   }

  @Put('/cancel/:id')
  @Roles(RoleEnum.CUSTOMER)
  async customerCancelOrder(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.customerCancelOrder(id, user);
  }
}
