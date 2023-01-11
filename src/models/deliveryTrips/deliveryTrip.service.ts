/* eslint-disable no-console */
import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { DeliveryTripEntity } from './entities/deliveryTrip.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
// import { CreateDeliveryTripDTO } from './dto/createDeliveryTrip.dto';
import { ShippersService } from '../shippers/shippers.service';
import { OrdersService } from '../orders/order.service';
import { StationsService } from '../stations/stations.service';
import { KitchenService } from '../kitchens/kitchens.service';
import { DeliveryTripEnum } from 'src/common/enums/deliveryTrip.enum';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderEnum } from 'src/common/enums/order.enum';
import { DirectShipperDTO, UpdateStatusTrip } from './dto/updateStatusTrip.dto';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import {
  TripFilter,
  TripFilterByKitchen,
  TripFilterBySession,
  TripFilterDate,
} from './dto/deliveryTrip-filter.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AssignShipperDTO, CreateTripDTO } from './dto/createDeliveryTrip.dto';
import { SessionService } from '../sessions/sessions.service';
import { BatchEntity } from '../batchs/entities/batch.entity';
import { SettingConfig } from 'src/common/types/setting_config';
import { BatchService } from '../batchs/batch.service';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import axios from 'axios';
import { SessionEnum } from 'src/common/enums/session.enum';
import { BatchEnum } from 'src/common/enums/batch.enum';

@Injectable()
export class DeliveryTripService extends BaseService<DeliveryTripEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(DeliveryTripEntity)
    private readonly deliveryTripRepository: Repository<DeliveryTripEntity>,
    private readonly shipperService: ShippersService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
    private readonly kitchenService: KitchenService,
    private readonly timeSlotService: TimeSlotsService,
    private readonly stationService: StationsService,
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => SessionService))
    private readonly sessionService: SessionService,
    private readonly batchService: BatchService,
  ) {
    super(deliveryTripRepository);
  }

  async getAllDeliveryTrip(filter: TripFilter): Promise<DeliveryTripEntity[]> {
    const { status } = filter;
    return await this.deliveryTripRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
      relations: {
        shipper: { account: { profile: true } },
        // kitchen: { account: { profile: true } },
        // order: true,
        // station: true,
        // time_slot: true,
      },
    });
  }

  // async getDeliveryTripByKitchen(
  //   kitchen: AccountEntity,
  //   filter: TripFilterByKitchen,
  // ): Promise<DeliveryTripEntity[]> {
  //   const { status } = filter;
  //   return await this.deliveryTripRepository.find({
  //     where: {
  //       // kitchen: { id: kitchen.id },
  //       status: Like(Boolean(status) ? status : '%%'),
  //       deliveryDate: filter.deliveryDate,
  //     },
  //     relations: {
  //       // kitchen: { account: { profile: true } },
  //       // order: true,
  //       // station: true,
  //       // time_slot: true,
  //     },
  //   });
  // }

  async getDeliveryTripBySession(
    filter: TripFilterBySession,
  ): Promise<DeliveryTripEntity[]> {
    const { status } = filter;
    const sessionFind = await this.sessionService.findOne({
      where: { id: filter.sessionId },
    });
    if (!sessionFind || sessionFind == null) {
      throw new HttpException(
        `session ${filter.sessionId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const listTrip = await this.deliveryTripRepository.find({
      where: {
        session: { id: filter.sessionId },
        status: status,
      },
      relations: {
        batchs: { orders: true, station: true },
        shipper: { account: { profile: true } },
        session: { timeSlot: true },
      },
    });
    if (!listTrip || listTrip.length == 0) {
      throw new HttpException('No trip found', HttpStatus.NOT_FOUND);
    }
    return listTrip;
  }

  async getDeliveryTripByStatus(
    user: AccountEntity,
    filter: TripFilter,
  ): Promise<DeliveryTripEntity[]> {
    const { status } = filter;
    return await this.deliveryTripRepository.find({
      where: {
        shipper: { id: user.id },
        status: Like(Boolean(status) ? status : '%%'),
      },
      relations: {
        // shipper: { kitchen: { account: { profile: true } } },
        // batchs: { orders: { subscription: { account: { profile: true } } } },
        batchs: { orders: true, station: true },
        session: { timeSlot: true },
      },
    });
  }

  async getDeliveryTripByDeliveryDate(
    user: AccountEntity,
    filter: TripFilterDate,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      where: {
        shipper: { id: user.id },
        deliveryDate: filter.deliveryDate,
      },
      relations: {
        batchs: { orders: true, station: true },
        session: { timeSlot: true },
      },
    });
  }

  async getDeliveryTripByShipper(
    user: AccountEntity,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      where: {
        shipper: { id: user.id },
        // status: DeliveryTripEnum.WAITING || DeliveryTripEnum.DELIVERY,
      },
      relations: {
        batchs: { orders: true, station: true },
        session: { timeSlot: true },
      },
    });
  }

  async listTripBySession(sessionId: string): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      where: { session: { id: sessionId } },
      relations: { batchs: { station: true } },
    });
  }

  async createTrip(dto: CreateTripDTO): Promise<DeliveryTripEntity[]> {
    const sessionFind = await this.sessionService.findOne({
      where: { id: dto.sessionId },
      relations: { batchs: { station: true } },
    });
    const newSet = new Set(sessionFind.batchs.map((i) => i.station.id));
    const newMap = new Map<string, BatchEntity[]>();
    newSet.forEach((e) => {
      const listBatch: BatchEntity[] = [];
      newMap.set(e, listBatch);
    });
    for (const item of sessionFind.batchs) {
      if (newMap.has(item.station.id)) {
        newMap.get(item.station.id).push(item);
      }
    }
    const arrPromiseTrip: Promise<BatchEntity>[] = [];
    const listOneBatch: BatchEntity[] = [];
    for (const value of newMap.values()) {
      for (let i = 0; i < value.length; i++) {
        if (i % 2 == 0) {
          const arrSub = value.slice(i, i + 2);
          if (arrSub.length == 2) {
            const trip = await this.deliveryTripRepository.save({
              session: sessionFind,
              deliveryDate: sessionFind.workDate,
            });
            arrSub.map((j) => {
              arrPromiseTrip.push(
                this.batchService.save({
                  id: j.id,
                  deliveryTrip: trip,
                }),
              );
            });
            await Promise.all(arrPromiseTrip);
          } else {
            listOneBatch.push(arrSub[0]);
          }
        }
      }
    }
    const arrPromiseSingleBatch: Promise<BatchEntity>[] = [];
    let newTrip;

    for (let z = 0; z < listOneBatch.length; z++) {
      if (listOneBatch.length < 2) {
        newTrip = await this.deliveryTripRepository.save({
          session: sessionFind,
          deliveryDate: sessionFind.workDate,
        });
        await this.batchService.save({
          id: listOneBatch[0].id,
          deliveryTrip: newTrip,
        });
        break;
      } else {
        const firstBatch = listOneBatch[0];
        const origin = `${firstBatch.station.coordinate['coordinates'][0]},${firstBatch.station.coordinate['coordinates'][1]}`;
        const destinations = listOneBatch
          .filter((i) => i.id != firstBatch.id)
          .map((h) => {
            const subDestination = `${h.station.coordinate['coordinates'][0]},${h.station.coordinate['coordinates'][1]}`;
            return subDestination;
          })
          .join('%7C');
        const listDistance = await axios.get(
          `https://rsapi.goong.io/DistanceMatrix?origins=${origin}&destinations=${destinations}&vehicle=bike&api_key=DuKETIrSZD6KjGweBEgitOzSOBEsGWWjys2ea1jW`,
        );
        const arrResultDistance = listDistance.data.rows[0].elements;
        let subSingleBatch = [];
        for (let e = 0; e < arrResultDistance.length; e++) {
          if (
            arrResultDistance[e].distance.value < SettingConfig.MAX_DISTANCE
          ) {
            subSingleBatch = [firstBatch, listOneBatch[e + 1]];
            newTrip = await this.deliveryTripRepository.save({
              session: sessionFind,
              deliveryDate: sessionFind.workDate,
            });
            subSingleBatch.map((s) => {
              arrPromiseSingleBatch.push(
                this.batchService.save({
                  id: s.id,
                  deliveryTrip: newTrip,
                }),
              );
            });
            listOneBatch.splice(0, 1);
            listOneBatch.splice(e, 1);
            await Promise.all(arrPromiseSingleBatch);
            if (listOneBatch.length == 1) {
              newTrip = await this.deliveryTripRepository.save({
                session: sessionFind,
                deliveryDate: sessionFind.workDate,
              });
              await this.batchService.save({
                id: listOneBatch[0].id,
                deliveryTrip: newTrip,
              });
            }
            break;
          }
          if (e == arrResultDistance.length - 1) {
            newTrip = await this.deliveryTripRepository.save({
              session: sessionFind,
              deliveryDate: sessionFind.workDate,
            });
            await this.batchService.save({
              id: firstBatch.id,
              deliveryTrip: newTrip,
            });
            listOneBatch.splice(0, 1);
            if (listOneBatch.length == 1) {
              newTrip = await this.deliveryTripRepository.save({
                session: sessionFind,
                deliveryDate: sessionFind.workDate,
              });
              await this.batchService.save({
                id: listOneBatch[0].id,
                deliveryTrip: newTrip,
              });
            }
          }
        }
      }
    }
    return await this.deliveryTripRepository.find({
      where: { session: { id: dto.sessionId } },
      relations: { batchs: { station: true } },
    });
  }

  async assignShipperToTrip(
    dto: AssignShipperDTO,
  ): Promise<DeliveryTripEntity[]> {
    const sessionFind = await this.sessionService.findOne({
      where: { id: dto.sessionId },
      relations: { kitchen: true, deliveryTrips: { batchs: { orders: true } } },
    });
    const listTrip = await this.deliveryTripRepository.find({
      where: { session: { id: dto.sessionId } },
    });

    if (dto.shipperIds.length != listTrip.length) {
      throw new HttpException('shipper not enough', HttpStatus.BAD_REQUEST);
    } else {
      for (let i = 0; i < dto.shipperIds.length; i++) {
        const shipperFind = await this.shipperService.findOne({
          where: { id: dto.shipperIds[i] },
          relations: { kitchen: true, account: { profile: true } },
        });
        if (
          shipperFind.kitchen == null ||
          sessionFind.kitchen.id != shipperFind.kitchen.id
        ) {
          throw new HttpException(
            `shipper ${shipperFind.account.profile.fullName} is not in your kitchen `,
            HttpStatus.BAD_REQUEST,
          );
        } else {
          await this.deliveryTripRepository.save({
            id: listTrip[i].id,
            shipper: shipperFind,
          });
        }
      }
    }
    const updateSession = await this.sessionService.save({
      id: sessionFind.id,
      status: SessionEnum.PROCESSING,
    });
    const arrUpdateOrderPromise: Promise<OrderEntity>[] = [];
    if (!updateSession) {
      throw new HttpException('can not update session', HttpStatus.BAD_REQUEST);
    } else {
      sessionFind.deliveryTrips.map((t) => {
        t.batchs.map((b) => {
          b.orders.map((o) => {
            arrUpdateOrderPromise.push(
              this.orderService.save({
                id: o.id,
                status: OrderEnum.PROGRESS,
              }),
            );
          });
        });
      });
      await Promise.all(arrUpdateOrderPromise);
    }
    return await this.deliveryTripRepository.find({
      where: { session: { id: dto.sessionId } },
      relations: { batchs: { orders: true } },
    });
  }
  //-------------------------------------------
  // async createDeliveryTrip(
  //   dto: CreateDeliveryTripDTO,
  // ): Promise<DeliveryTripEntity> {
  //   const shipper = await this.shipperService.findOne({
  //     where: { id: dto.shipperId },
  //   });
  //   if (!shipper) {
  //     throw new HttpException(`Shipper not found`, HttpStatus.NOT_FOUND);
  //   }
  //   // const station = await this.stationService.findOne({
  //   //   where: { id: dto.stationId },
  //   // });
  //   // if (!station) {
  //   //   throw new HttpException(`Station not found`, HttpStatus.NOT_FOUND);
  //   // }
  //   const timeSlotFind = await this.timeSlotService.findOne({
  //     where: { id: dto.timeSlotId },
  //   });
  //   if (!timeSlotFind) {
  //     throw new HttpException(`Time slot not found`, HttpStatus.NOT_FOUND);
  //   }
  //   const kitchen = await this.kitchenService.findOne({
  //     where: { id: dto.kitchenId },
  //   });
  //   if (!kitchen) {
  //     throw new HttpException(`Kitchen not found`, HttpStatus.NOT_FOUND);
  //   }
  //   const newTrip = await this.deliveryTripRepository.save({
  //     status: DeliveryTripEnum.WAITING,
  //     deliveryDate: dto.deliveryDate,
  //     kitchen: kitchen,
  //     shipper: shipper,
  //     // station: station,
  //     time_slot: timeSlotFind,
  //   });

  //   if (!newTrip) {
  //     throw new HttpException(
  //       'Fail to create delivery trip',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }

  //   for (const item of dto.ordersIds) {
  //     const callback = async (entityManager: EntityManager): Promise<void> => {
  //       await entityManager.update(
  //         OrderEntity,
  //         { id: item.valueOf() },
  //         { deliveryTrips: newTrip, status: OrderEnum.READY },
  //       );
  //     };
  //     await this.orderService.transaction(callback, this.dataSource);
  //   }
  //   return await this.deliveryTripRepository.findOne({
  //     where: { id: newTrip.id },
  //     relations: {
  //       shipper: true,
  //       // station: true,
  //       // kitchen: true,
  //       order: true,
  //       // time_slot: true,
  //     },
  //   });
  // }

  async getTripById(tripId: string): Promise<DeliveryTripEntity> {
    const trip = await this.deliveryTripRepository.findOne({
      where: { id: tripId },
      // relations: { order: { timeSlot: true } },
      relations: {
        session: { timeSlot: true },
        batchs: {
          orders: { subscription: { account: { profile: true } } },
          station: true,
        },
      },
    });

    if (!trip) {
      throw new HttpException('No trip found', HttpStatus.NOT_FOUND);
    } else {
      return trip;
    }
  }

  async updateStatusTrip(
    orderIds: UpdateStatusTrip,
  ): Promise<DeliveryTripEntity> {
    const trip = await this.deliveryTripRepository.findOne({
      where: { id: orderIds.deliveryTripId },
      relations: { batchs: { orders: true } },
    });
    // const picktime = new Date();
    // const time =
    //   picktime.getHours().toString() +
    //   ':' +
    //   picktime.getMinutes().toString() +
    //   ':' +
    //   picktime.getSeconds().toString();

    const arrUpdateBatchPromise: Promise<BatchEntity>[] = [];
    const arrUpdateOrderPromise: Promise<OrderEntity>[] = [];
    if (trip.status == DeliveryTripEnum.READY) {
      const updateTrip = await this.deliveryTripRepository.update(
        { id: orderIds.deliveryTripId },
        {
          status: DeliveryTripEnum.DELIVERY,
          deliveryTime: orderIds.updateTime,
        },
      );
      if (updateTrip) {
        trip.batchs.map((b) => {
          arrUpdateBatchPromise.push(
            this.batchService.save({
              id: b.id,
              status: BatchEnum.DELIVERY,
            }),
          );
          b.orders.map((o) => {
            arrUpdateOrderPromise.push(
              this.orderService.save({
                id: o.id,
                status: OrderEnum.DELIVERY,
              }),
            );
          });
          Promise.all(arrUpdateOrderPromise);
        });
        await Promise.all(arrUpdateBatchPromise);
      }
    } else if (trip.status == DeliveryTripEnum.DELIVERY) {
      const updateTrip = await this.deliveryTripRepository.update(
        { id: orderIds.deliveryTripId },
        { status: DeliveryTripEnum.ARRIVED, arrivedTime: orderIds.updateTime },
      );
      if (updateTrip) {
        trip.batchs.map((b) => {
          arrUpdateBatchPromise.push(
            this.batchService.save({
              id: b.id,
              status: BatchEnum.ARRIVED,
            }),
          );
          b.orders.map((o) => {
            arrUpdateOrderPromise.push(
              this.orderService.save({
                id: o.id,
                status: OrderEnum.ARRIVED,
              }),
            );
          });
          Promise.all(arrUpdateOrderPromise);
        });
        await Promise.all(arrUpdateBatchPromise);
      }
    }
    const freshTrip = await this.deliveryTripRepository.findOne({
      where: { id: orderIds.deliveryTripId },
      relations: { batchs: { orders: true } },
    });
    return freshTrip;
  }

  async rejectByShipper(id: string, user: AccountEntity): Promise<string> {
    const trip = await this.deliveryTripRepository.findOne({
      where: { id: id, shipper: { id: user.id } },
    });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    const reject = await this.deliveryTripRepository.update(
      {
        id: id,
        shipper: { id: user.id },
        status: DeliveryTripEnum.WAITING,
      },
      {
        status: DeliveryTripEnum.REJECT,
      },
    );
    if (reject) {
      return 'Reject success';
    } else {
      return 'Fail to reject';
    }
  }

  async directShipperByManager(transfer: DirectShipperDTO): Promise<string> {
    const trip = await this.deliveryTripRepository.findOne({
      where: { id: transfer.deliveryTripId, status: DeliveryTripEnum.REJECT },
      relations: { shipper: true },
    });
    if (!trip) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
    if (trip.shipper.id == transfer.shipperId) {
      throw new HttpException(
        'Unable to transfer to old shipper',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const directShipper = await this.deliveryTripRepository.update(
        {
          id: transfer.deliveryTripId,
          status: DeliveryTripEnum.REJECT,
        },
        {
          shipper: { id: transfer.shipperId },
          status: DeliveryTripEnum.WAITING,
        },
      );
      if (directShipper) {
        return 'Transfer success';
      } else {
        return 'Transfer fail';
      }
    }
  }
}
