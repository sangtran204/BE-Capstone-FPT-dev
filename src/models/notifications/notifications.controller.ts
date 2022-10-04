import { Controller, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { GetUser } from '../../decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { IPaginate, paginate } from '../base/base.filter';
import { NotificationDto } from './dto/notification.dto';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get('/me')
  async getMyNotifications(
    @GetUser() user: AccountEntity,
    @Query() queries: QueryNotificationDto,
  ): Promise<IPaginate<NotificationDto>> {
    const result = await this.notificationsService.getMyNotifications(
      user,
      queries,
    );
    return paginate<NotificationDto>(
      result,
      queries.currentPage,
      queries.sizePage,
    );
  }

  @Put('/:id')
  async seenNotification(@Param('id') id: string): Promise<string> {
    return this.notificationsService.seenNotification(id);
  }
}
