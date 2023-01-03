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
  TripFilterDate,
} from './dto/deliveryTrip-filter.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateTripDTO } from './dto/createDeliveryTrip.dto';
import { SessionService } from '../sessions/sessions.service';
import { BatchEntity } from '../batchs/entities/batch.entity';
import { SettingConfig } from 'src/common/types/setting_config';
import { BatchService } from '../batchs/batch.service';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';

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

  async getDeliveryTripByKitchen(
    kitchen: AccountEntity,
    filter: TripFilterByKitchen,
  ): Promise<DeliveryTripEntity[]> {
    const { status } = filter;
    return await this.deliveryTripRepository.find({
      where: {
        // kitchen: { id: kitchen.id },
        status: Like(Boolean(status) ? status : '%%'),
        deliveryDate: filter.deliveryDate,
      },
      relations: {
        // kitchen: { account: { profile: true } },
        // order: true,
        // station: true,
        // time_slot: true,
      },
    });
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
        // kitchen: { account: { profile: true } },
        // order: true,
        // station: true,
        // time_slot: true,
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
        // kitchen: { account: { profile: true } },
        // order: true,
        // station: true,
        // time_slot: true,
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
        // kitchen: { account: { profile: true } },
        // order: true,
        // station: true,
        // time_slot: true,
      },
    });
  }

  async createTrip(dto: CreateTripDTO): Promise<DeliveryTripEntity[]> {
    const sessionFind = await this.sessionService.findOne({
      where: { id: dto.sessionId },
      relations: { batchs: true },
    });
    if (!sessionFind || sessionFind == null)
      throw new HttpException('session not found', HttpStatus.NOT_FOUND);

    for (let i = 0; i < sessionFind.batchs.length; i++) {
      const ibatch = await this.batchService.findOne({
        where: { id: sessionFind.batchs[i].id },
        relations: { station: true },
      });

      const listTrip = await this.deliveryTripRepository.find({
        where: { session: { id: sessionFind.id } },
        relations: { batchs: { station: true } },
      });

      let tripFind;
      if (!listTrip || listTrip.length == 0) {
        tripFind = await this.deliveryTripRepository.save({
          session: sessionFind,
          deliveryDate: sessionFind.workDate,
        });
        await this.batchService.save({
          id: ibatch.id,
          deliveryTrip: tripFind,
        });
        // console.log('list null');
      } else {
        console.log('list no null');

        for (let j = 0; j < listTrip.length; j++) {
          if (listTrip[j].batchs.length < SettingConfig.MAX_BATCH) {
            if (listTrip[j].batchs[0].station.id == ibatch.station.id) {
              console.log(listTrip[j].batchs[0].station.id);

              await this.batchService.save({
                id: ibatch.id,
                deliveryTrip: listTrip[j],
              });
            } else if (listTrip[j].batchs[0].station.id != ibatch.station.id) {
              tripFind = await this.deliveryTripRepository.save({
                session: sessionFind,
                deliveryDate: sessionFind.workDate,
              });
              await this.batchService.save({
                id: ibatch.id,
                deliveryTrip: tripFind,
              });
            }
            break;
            // console.log(listTrip[i].batchs);
          } else if (listTrip[j].batchs.length >= SettingConfig.MAX_BATCH) {
            // tripFind = await this.deliveryTripRepository.save({
            //   session: sessionFind,
            //   deliveryDate: sessionFind.workDate,
            // });
            // await this.batchService.save({
            //   id: ibatch.id,
            //   deliveryTrip: tripFind,
            // });
            j++;
          }
        }
      }

      // let tripFind = await this.deliveryTripRepository.findOne({
      //   where: {
      //     session: { id: ibatch.session.id },
      //     deliveryDate: ibatch.session.workDate,
      //   },
      //   relations: { batchs: { station: true } },
      // });

      // if (
      //   !tripFind ||
      //   tripFind == null
      //   // ||
      //   // tripFind?.batchs.length >= SettingConfig.MAX_BATCH
      // ) {
      //   // throw new HttpException('check null', HttpStatus.NOT_FOUND);
      //   // console.log(tripFind.batchs.length >= SettingConfig.MAX_BATCH);
      //   console.log('null');
      //   tripFind = await this.deliveryTripRepository.save({
      //     session: sessionFind,
      //     deliveryDate: sessionFind.workDate,
      //   });
      //   await this.batchService.save({
      //     id: ibatch.id,
      //     deliveryTrip: tripFind,
      //   });
      // } else if (tripFind !== null || tripFind) {
      //   // throw new HttpException('check not null', HttpStatus.BAD_REQUEST);
      //   // console.log(tripFind.batchs.length < SettingConfig.MAX_BATCH);
      //   if (tripFind.batchs.length < SettingConfig.MAX_BATCH) {
      //     console.log(` length : ${tripFind.batchs.length}`);
      //     console.log(
      //       `check: ${tripFind.batchs.length < SettingConfig.MAX_BATCH}`,
      //     );
      //     if (tripFind.batchs[0].station.id == ibatch.station.id) {
      //       console.log('double station');
      //       await this.batchService.save({
      //         id: ibatch.id,
      //         deliveryTrip: tripFind,
      //       });
      //     } else {
      //       tripFind = await this.deliveryTripRepository.save({
      //         session: sessionFind,
      //         deliveryDate: sessionFind.workDate,
      //       });
      //       await this.batchService.save({
      //         id: ibatch.id,
      //         deliveryTrip: tripFind,
      //       });
      //     }
      //     // console.log('bé hơn 1');
      //   }
      //   if (tripFind.batchs?.length >= SettingConfig.MAX_BATCH) {
      //     console.log('more 1 batch');
      //     tripFind = await this.deliveryTripRepository.save({
      //       session: sessionFind,
      //       deliveryDate: sessionFind.workDate,
      //     });
      //     await this.batchService.save({
      //       id: ibatch.id,
      //       deliveryTrip: tripFind,
      //     });
      //     // console.log('lớn hơn 1');
      //   }
      // }
      // else if (
      //   !tripFind ||
      //   tripFind == null
      //   // ||
      //   // tripFind.batchs.length >= SettingConfig.MAX_BATCH
      // ) {
      //   // throw new HttpException('check null', HttpStatus.NOT_FOUND);
      //   tripFind = await this.deliveryTripRepository.save({
      //     session: sessionFind,
      //     deliveryDate: sessionFind.workDate,
      //   });
      //   await this.batchService.save({
      //     id: ibatch.id,
      //     deliveryTrip: tripFind,
      //   });
      // }
    }
    const listTrip = await this.deliveryTripRepository.find({
      where: { session: { id: dto.sessionId } },
      relations: { batchs: { station: true } },
    });
    return listTrip;
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
      relations: { batchs: { orders: true, station: true } },
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
    });
    // const picktime = new Date();
    // const time =
    //   picktime.getHours().toString() +
    //   ':' +
    //   picktime.getMinutes().toString() +
    //   ':' +
    //   picktime.getSeconds().toString();

    if (trip.status == DeliveryTripEnum.WAITING) {
      const updateTrip = await this.deliveryTripRepository.update(
        { id: orderIds.deliveryTripId },
        {
          status: DeliveryTripEnum.DELIVERY,
          deliveryTime: orderIds.updateTime,
        },
      );
      if (updateTrip) {
        for (const item of orderIds.ordersIds) {
          const callback = async (
            entityManager: EntityManager,
          ): Promise<void> => {
            await entityManager.update(
              OrderEntity,
              { id: item.valueOf() },
              { status: OrderEnum.DELIVERY },
            );
          };
          await this.orderService.transaction(callback, this.dataSource);
        }
      }
    } else if (trip.status == DeliveryTripEnum.DELIVERY) {
      const updateTrip = await this.deliveryTripRepository.update(
        { id: orderIds.deliveryTripId },
        { status: DeliveryTripEnum.ARRIVED, arrivedTime: orderIds.updateTime },
      );
      if (updateTrip) {
        for (const item of orderIds.ordersIds) {
          const callback = async (
            entityManager: EntityManager,
          ): Promise<void> => {
            await entityManager.update(
              OrderEntity,
              { id: item.valueOf() },
              { status: OrderEnum.ARRIVED },
            );
          };
          await this.orderService.transaction(callback, this.dataSource);
        }
      }
    }
    const freshTrip = await this.deliveryTripRepository.findOne({
      where: { id: orderIds.deliveryTripId },
      // relations: { order: true },
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
