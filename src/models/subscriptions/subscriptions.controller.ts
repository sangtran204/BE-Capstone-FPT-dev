import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Delete,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { VnpayDto } from 'src/providers/vnpay/vnpay.dto';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateSubscriptionDTO } from './dto/create-subscription';
import { SubHistoryDTO } from './dto/getSub-history.dto';
import { SubscriptionFilter } from './dto/subscription-filter.dto';
import { SubscriptionDTO } from './dto/subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './subscriptions.service';

@ApiBearerAuth()
@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL SUB',
    type: [SubscriptionDTO],
  })
  // @UseInterceptors(
  //   MapInterceptor(SubscriptionEntity, SubscriptionDTO, { isArray: true }),
  // )
  async getAllSubscription(): Promise<SubscriptionEntity[]> {
    const listSub = await this.subscriptionService.getAllSubscription();
    if (!listSub || listSub.length == 0) {
      throw new HttpException("Don't have resource Sub", HttpStatus.NOT_FOUND);
    }
    return listSub;
  }

  @Get('/getSubByStatus')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'GET SUBSCRIPTION BY STATUS',
    type: [SubscriptionEntity],
  })
  async getSubscriptionByStatus(
    @Query() subFilter: SubscriptionFilter,
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionService.getSubscriptionByStatus(subFilter);
  }

  @Get('/customer/getSubscription')
  @ApiResponse({
    status: 200,
    description: 'CUSTOMER GET SUBSCRIPTION BY STATUS',
    type: [SubscriptionDTO],
  })
  // @UseInterceptors(
  //   MapInterceptor(SubscriptionEntity, SubscriptionDTO, { isArray: true }),
  // )
  async getSubscriptionByCutomer(
    @Query() subFilter: SubscriptionFilter,
    @GetUser() user: AccountEntity,
  ): Promise<SubHistoryDTO[]> {
    const listSub = await this.subscriptionService.getSubscriptionByCustomer(
      subFilter,
      user,
    );
    if (!listSub || listSub.length == 0) {
      throw new HttpException("Don't have resource Sub", HttpStatus.NOT_FOUND);
    }
    return listSub;
  }

  @Get('/:id')
  @ApiResponse({
    status: 200,
    description: 'GET SUB BY ID',
    type: SubscriptionDTO,
  })
  @UseInterceptors(MapInterceptor(SubscriptionEntity, SubscriptionDTO))
  async findById(@Param('id') id: string): Promise<SubscriptionEntity> {
    return this.subscriptionService.findById(id);
  }

  @Post()
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponse({
    status: 200,
    description: 'CREATE SUB',
    type: SubscriptionDTO,
  })
  @UseInterceptors(MapInterceptor(SubscriptionEntity, SubscriptionDTO))
  async orderPackage(
    @Body() dto: CreateSubscriptionDTO,
    @GetUser() user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionService.subscriptionPackage(dto, user);
  }

  @Put('/confirm/:id')
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponse({
    status: 200,
    description: 'CONFIRM SUB',
    type: String,
  })
  async customerConfirm(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.subscriptionService.customerConfirm(id, user);
  }

  @Put('/done/:id')
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponse({
    status: 200,
    description: 'DONE SUB',
    type: String,
  })
  async doneSub(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.subscriptionService.doneSub(id, user);
  }

  @Put('/cancel/:id')
  @Roles(RoleEnum.CUSTOMER)
  @ApiResponse({
    status: 200,
    description: 'CANCEL SUB',
    type: String,
  })
  async cancelSubscription(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.subscriptionService.cancelSubscription(id, user);
  }

  @Get('/payment')
  @Public()
  @Render('index')
  async payment(@Query() vnpayDto: VnpayDto): Promise<{
    message: string;
    code: string;
    isSuccess: boolean;
  }> {
    try {
      const result = await this.subscriptionService.payment(vnpayDto);
      return result.code === '00'
        ? { ...result, isSuccess: true }
        : { ...result, isSuccess: false };
    } catch (error) {
      return error;
    }
  }

  @Delete('/delete/:id')
  @ApiResponse({
    status: 200,
    description: 'CUSTOMER DELETE SUBSCRIPTION',
    type: String,
  })
  async delSub(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.subscriptionService.deleteSubscription(id, user);
  }
}
