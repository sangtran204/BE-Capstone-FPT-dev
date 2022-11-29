import { DataSource, EntityManager, Like, Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { DeliveryTripEntity } from './entities/deliveryTrip.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateDeliveryTripDTO } from './dto/createDeliveryTrip.dto';
import { ShippersService } from '../shippers/shippers.service';
import { OrdersService } from '../orders/order.service';
import { StationsService } from '../stations/stations.service';
import { KitchenService } from '../kitchens/kitchens.service';
import { DeliveryTripEnum } from 'src/common/enums/deliveryTrip.enum';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrderEnum } from 'src/common/enums/order.enum';
import { UpdateStatusTrip } from './dto/updateStatusTrip.dto';
import { TimeSlotsService } from '../time-slots/time-slots.service';
import { TripFilter, TripFilterByKitchen } from './dto/deliveryTrip-filter.dto';

@Injectable()
export class DeliveryTripService extends BaseService<DeliveryTripEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(DeliveryTripEntity)
    private readonly deliveryTripRepository: Repository<DeliveryTripEntity>,
    private readonly shipperService: ShippersService,
    private readonly orderService: OrdersService,
    private readonly kitchenService: KitchenService,
    private readonly timeSlotService: TimeSlotsService,
    private readonly stationService: StationsService,
  ) {
    super(deliveryTripRepository);
  }

  async getAllDeliveryTrip(): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      relations: { shipper: true, kitchen: true, order: true, station: true },
    });
  }

  async getDeliveryTripByKitchen(
    kitchen: AccountEntity,
    filter: TripFilterByKitchen,
  ): Promise<DeliveryTripEntity[]> {
    const { status } = filter;
    return await this.deliveryTripRepository.find({
      where: {
        kitchen: { id: kitchen.id },
        status: Like(Boolean(status) ? status : '%%'),
        deliveryDate: filter.deliveryDate,
      },
      relations: {
        kitchen: { account: { profile: true } },
        order: true,
        station: true,
        time_slot: true,
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
        kitchen: { account: { profile: true } },
        order: true,
        station: true,
        time_slot: true,
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
        kitchen: { account: { profile: true } },
        order: true,
        station: true,
        time_slot: true,
      },
    });
  }

  async createDeliveryTrip(
    dto: CreateDeliveryTripDTO,
  ): Promise<DeliveryTripEntity> {
    const shipper = await this.shipperService.findOne({
      where: { id: dto.shipperId },
    });
    if (!shipper) {
      throw new HttpException(`Shipper not found`, HttpStatus.NOT_FOUND);
    }
    const station = await this.stationService.findOne({
      where: { id: dto.stationId },
    });
    if (!station) {
      throw new HttpException(`Station not found`, HttpStatus.NOT_FOUND);
    }
    const timeSlotFind = await this.timeSlotService.findOne({
      where: { id: dto.timeSlotId },
    });
    if (!timeSlotFind) {
      throw new HttpException(`Time slot not found`, HttpStatus.NOT_FOUND);
    }
    const kitchen = await this.kitchenService.findOne({
      where: { id: dto.kitchenId },
    });
    if (!kitchen) {
      throw new HttpException(`Kitchen not found`, HttpStatus.NOT_FOUND);
    }
    const newTrip = await this.deliveryTripRepository.save({
      status: DeliveryTripEnum.WAITING,
      deliveryDate: dto.deliveryDate,
      kitchen: kitchen,
      shipper: shipper,
      station: station,
      time_slot: timeSlotFind,
    });

    if (!newTrip) {
      throw new HttpException(
        'Fail to create delivery trip',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (const item of dto.ordersIds) {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          OrderEntity,
          { id: item.valueOf() },
          { deliveryTrips: newTrip, status: OrderEnum.READY },
        );
      };
      await this.orderService.transaction(callback, this.dataSource);
    }
    return await this.deliveryTripRepository.findOne({
      where: { id: newTrip.id },
      relations: {
        shipper: true,
        station: true,
        kitchen: true,
        order: true,
        time_slot: true,
      },
    });
  }

  async getTripById(tripId: string): Promise<DeliveryTripEntity> {
    const trip = await this.deliveryTripRepository.findOne({
      where: { id: tripId },
      relations: { order: { timeSlot: true }, station: true },
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
    const picktime = new Date();
    const time =
      picktime.getHours().toString() +
      ':' +
      picktime.getMinutes().toString() +
      ':' +
      picktime.getSeconds().toString();

    if (trip.status == DeliveryTripEnum.WAITING) {
      const updateTrip = await this.deliveryTripRepository.update(
        { id: orderIds.deliveryTripId },
        { status: DeliveryTripEnum.DELIVERY, deliveryTime: time },
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
        { status: DeliveryTripEnum.ARRIVED, arrivedTime: time },
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
      relations: { order: true },
    });
    return freshTrip;
  }
}
