// import { AccountEntity } from 'models/accounts/entities/account.entity';
// import { RoleEnum } from 'common/enums/role.enum';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { OrderTourCreationDto } from './dto/order-tour-creation.dto';
import { OrderEntity } from './entities/order.entity';
import { MapInterceptor } from '@automapper/nestjs';
import { OrderDTO } from './dto/order.dto';
// import { VnpayDto } from '../../providers/vnpay/vnpay.dto';
import { Public } from '../../decorators/public.decorator';
import { OrdersService } from './order.service';
import { OrderFilterDTO, OrderSearchByDate } from './dto/order-filter.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { OrderCreationDTO } from './dto/create-order.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { FoodByKitchenDTO } from '../foods/dto/foodByKitchen.dto';

@ApiBearerAuth()
@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Get()
  // async findAll(
  //   @Query() orderFilter: OrderFilter,
  // ): Promise<IPaginate<OrderDTO>> {
  //   const data = await this.ordersService.findAll(orderFilter);
  //   return paginate<OrderDTO>(
  //     data,
  //     orderFilter.currentPage,
  //     orderFilter.sizePage,
  //   );
  // }

  @Post()
  @Roles(RoleEnum.CUSTOMER)
  @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  async orderSub(
    @Body() dto: OrderCreationDTO,
    @GetUser() user: AccountEntity,
  ): Promise<OrderEntity> {
    return await this.ordersService.orderSub(dto, user);
  }

  @Get('/byStatus')
  @ApiResponse({
    description: 'GET ORDER BY STATUS',
    status: 200,
    type: OrderEntity,
  })
  async getOrderByStatus(
    @Query() orderFilter: OrderFilterDTO,
  ): Promise<OrderEntity[]> {
    const list = await this.ordersService.getOrderByStatus(orderFilter);
    if (!list || list.length == 0) {
      throw new HttpException('No order found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  @Get('/order-date')
  @ApiResponse({
    description: 'GET ORDER BY STATUS AND DATE',
    status: 200,
    type: OrderEntity,
  })
  async getOrderByKitchen(
    @Query() data: OrderSearchByDate,
    @Query() orderFilter: OrderFilterDTO,
    // @Param('deliveryDate') deliveryDate: Date,
  ): Promise<OrderEntity[]> {
    const list = await this.ordersService.getOrderByStatusDate(
      data,
      orderFilter,
    );
    if (!list || list.length == 0) {
      throw new HttpException('No order found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  // @Get('/food-prepare')
  // @Public()
  // @ApiResponse({
  //   status: 200,
  //   description: 'Get food by kitchen',
  //   type: FoodByKitchenDTO,
  // })
  // async getFoodByKitchen(
  //   @Param('kitchenId') kitchenId: string,
  // ): Promise<FoodByKitchenDTO[]> {
  //   return await this.ordersService.getFoodByKitchen(kitchenId);
  // }

  @Get('/food-prepare')
  @Roles(RoleEnum.KITCHEN)
  @ApiResponse({
    status: 200,
    description: 'Get food by kitchen',
    type: FoodByKitchenDTO,
  })
  async getFoodByKitchen(
    @GetUser() user: AccountEntity,
    @Query() data: OrderSearchByDate,
  ): Promise<FoodByKitchenDTO[]> {
    return await this.ordersService.getFoodByKitchen(user, data);
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

  // @Put('/check-in/:id')
  // @Roles(RoleEnum.CUSTOMER)
  // @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  // async checkIn(
  //   @Param('id') id: string,
  //   @GetUser() user: AccountEntity,
  // ): Promise<OrderEntity> {
  //   return await this.ordersService.checkIn(id, user);
  // }

  // @Put('check-out/:id')
  // @Roles(RoleEnum.CUSTOMER)
  // @UseInterceptors(MapInterceptor(OrderEntity, OrderDTO))
  // async checkOut(
  //   @Param('id') id: string,
  //   @GetUser() user: AccountEntity,
  // ): Promise<OrderEntity> {
  //   return this.ordersService.checkOut(id, user);
  // }

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

  // @Put('/cancel/:id')
  // @Roles(RoleEnum.CUSTOMER)
  // async customerCancelOrder(
  //   @Param('id') id: string,
  //   @GetUser() user: AccountEntity,
  // ): Promise<OrderEntity> {
  //   return await this.ordersService.customerCancelOrder(id, user);
  // }
}
