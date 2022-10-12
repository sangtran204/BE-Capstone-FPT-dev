import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { GetUser } from 'src/decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateSubscriptionDTO } from './dto/create-subscription';
import { SubscriptionDTO } from './dto/subscription.dto';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionService } from './subscriptions.service';

@ApiBearerAuth()
@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Get all subscription
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all subscription',
    type: [SubscriptionEntity],
  })
  async getAllSubscription(): Promise<SubscriptionEntity[]> {
    return await this.subscriptionService.getAllSubscription();
  }

  //Create subscription
  @Post()
  @Roles(RoleEnum.CUSTOMER)
  //   @UseInterceptors(MapInterceptor(SubscriptionEntity, SubscriptionDTO))
  async orderPackage(
    @Body() dto: CreateSubscriptionDTO,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionService.subscriptionPackage(dto);
  }

  //Find subscription by id
  @Get('/:id')
  async findById(@Param('id') id: string): Promise<SubscriptionEntity> {
    return this.subscriptionService.findById(id);
  }

  //Check in subscription
  @Put('/check-in/:id')
  @Roles(RoleEnum.CUSTOMER)
  async checkIn(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionService.checkIn(id, user);
  }

  @Put('/check-out/:id')
  @Roles(RoleEnum.CUSTOMER)
  async checkOut(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionService.checkOut(id, user);
  }

  @Put('/cancel/:id')
  @Roles(RoleEnum.CUSTOMER)
  async cancelSubscription(
    @Param('id') id: string,
    @GetUser() user: AccountEntity,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionService.cancelSubscription(id, user);
  }
}
