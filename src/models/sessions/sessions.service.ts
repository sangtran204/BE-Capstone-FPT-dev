import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortEnum } from 'src/common/enums/sort.enum';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { KitchenService } from '../kitchens/kitchens.service';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { CreateSessionDTO } from './dto/createSession.dto';
import {
  KitchenFilterSession,
  SessionByDate,
  SessionFilterDTO,
} from './dto/session_filter.dto';
import { SessionEntity } from './entities/sessions.entity';
import * as moment from 'moment';
import { DeliveryTripEntity } from '../deliveryTrips/entities/deliveryTrip.entity';
import { SessionEnum } from 'src/common/enums/session.enum';
import { DeliveryTripService } from '../deliveryTrips/deliveryTrip.service';
import { DeliveryTripEnum } from 'src/common/enums/deliveryTrip.enum';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { OrdersService } from '../orders/order.service';
import { BatchEntity } from '../batchs/entities/batch.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { BatchService } from '../batchs/batch.service';
import { BatchEnum } from 'src/common/enums/batch.enum';
import { OrderEnum } from 'src/common/enums/order.enum';

@Injectable()
export class SessionService extends BaseService<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly kitchenService: KitchenService,
    private readonly timeSlotService: TimeSlotsService,
    @Inject(forwardRef(() => DeliveryTripService))
    private readonly tripService: DeliveryTripService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
    private readonly batchService: BatchService,
  ) {
    super(sessionRepository);
  }

  async createSession(dto: CreateSessionDTO): Promise<SessionEntity> {
    const kitchenFind = await this.kitchenService.findOne({
      where: { id: dto.kitchenId },
    });
    if (!kitchenFind || kitchenFind == null)
      throw new HttpException('Kitchen not found', HttpStatus.NOT_FOUND);

    const timeSlotFind = await this.timeSlotService.findOne({
      where: { id: dto.timeSlotId },
    });
    if (!timeSlotFind || timeSlotFind == null)
      throw new HttpException('Time slot not found', HttpStatus.NOT_FOUND);

    const newSession = await this.sessionRepository.save({
      workDate: dto.workDate,
      kitchen: kitchenFind,
      timeSlot: timeSlotFind,
    });
    if (!newSession)
      throw new HttpException(
        'create session fail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    return await this.sessionRepository.findOne({
      where: { id: newSession.id },
      relations: { timeSlot: true, kitchen: true },
    });
  }

  async getAllSessionByKitchen(
    user: AccountEntity,
    filter: SessionByDate,
  ): Promise<SessionEntity[]> {
    const kitchenFind = await this.kitchenService.findOne({
      where: { id: user.id },
    });
    if (!kitchenFind || kitchenFind == null)
      throw new HttpException('Kitchen not found', HttpStatus.NOT_FOUND);
    const listSession = await this.sessionRepository.find({
      where: { kitchen: { id: kitchenFind.id }, workDate: filter.workDate },
      relations: { timeSlot: true, batchs: { orders: true } },
      order: {
        timeSlot: {
          startTime: 'ASC',
        },
      },
    });
    if (listSession.length == 0 || !listSession)
      throw new HttpException('No session found', HttpStatus.NOT_FOUND);
    return listSession;
  }

  async getSessionDetail(id: string): Promise<SessionEntity> {
    const sessionDetail = await this.sessionRepository.findOne({
      where: { id: id },
      relations: {
        timeSlot: true,
        batchs: {
          station: true,
          orders: {
            packageItem: { foodGroup: { foods: true } },
            subscription: { account: { profile: true } },
          },
        },
      },
    });
    if (!sessionDetail || sessionDetail == null)
      throw new HttpException('No session found', HttpStatus.NOT_FOUND);
    return sessionDetail;
  }

  async doneSession(sessionId: string): Promise<SessionEntity> {
    const date = moment().format('YYYY-MM-DD');

    const sessionFind = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: {
        kitchen: true,
        deliveryTrips: { batchs: { orders: true } },
        // batchs: { orders: true },
      },
    });
    if (sessionFind == null || !sessionFind) {
      throw new HttpException(
        `session ${sessionId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    // if (sessionFind.workDate.toString() != date) {
    //   throw new HttpException(
    //     'today is not working day for session',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    const arrUpdateTripPromise: Promise<DeliveryTripEntity>[] = [];
    const arrUpdateBatchPromise: Promise<BatchEntity>[] = [];
    const arrUpdateOrderPromise: Promise<OrderEntity>[] = [];
    const updateSession = await this.sessionRepository.save({
      id: sessionFind.id,
      status: SessionEnum.DONE,
    });
    if (!updateSession) {
      throw new HttpException('can not done session', HttpStatus.BAD_REQUEST);
    }
    sessionFind.deliveryTrips.map((i) => {
      arrUpdateTripPromise.push(
        this.tripService.save({
          id: i.id,
          status: DeliveryTripEnum.READY,
        }),
      );
      i.batchs.map((b) => {
        arrUpdateBatchPromise.push(
          this.batchService.save({
            id: b.id,
            status: BatchEnum.READY,
          }),
        );
        b.orders.map((o) => {
          arrUpdateOrderPromise.push(
            this.orderService.save({
              id: o.id,
              status: OrderEnum.READY,
            }),
          );
        });
        Promise.all(arrUpdateOrderPromise);
      });
      Promise.all(arrUpdateBatchPromise);
    });
    await Promise.all(arrUpdateTripPromise);
    return await this.sessionRepository.findOne({
      where: { id: sessionFind.id },
      relations: { deliveryTrips: { batchs: { orders: true } } },
    });
  }
}
