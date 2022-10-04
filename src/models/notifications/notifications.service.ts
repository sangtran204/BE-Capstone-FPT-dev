import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { NotificationDto } from './dto/notification.dto';
import { StatusEnum } from '../../common/enums/status.enum';

@Injectable()
export class NotificationsService extends BaseService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationsRepository: Repository<NotificationEntity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(notificationsRepository);
  }

  async getMyNotifications(
    account: AccountEntity,
    queries: QueryNotificationDto,
  ): Promise<[NotificationDto[], number]> {
    const { currentPage, sizePage } = queries;
    const [notifications, count] =
      await this.notificationsRepository.findAndCount({
        where: { account: { id: account.id } },
        skip: sizePage * (currentPage - 1),
        take: sizePage,
        order: { createdAt: 'DESC' },
      });

    return [
      this.mapper.mapArray(notifications, NotificationEntity, NotificationDto),
      count,
    ];
  }

  async seenNotification(idNotification: string): Promise<string> {
    const notification = await this.findOne({ where: { id: idNotification } });
    if (!Boolean(notification))
      throw new HttpException('notification not found', HttpStatus.NOT_FOUND);
    notification.status = StatusEnum.SEEN;
    await this.notificationsRepository.save(notification);
    return 'seen success';
  }
}
