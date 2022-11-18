import { DataSource, EntityManager, Repository } from 'typeorm';
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

@Injectable()
export class DeliveryTripService extends BaseService<DeliveryTripEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(DeliveryTripEntity)
    private readonly deliveryTripRepository: Repository<DeliveryTripEntity>,
    private readonly shipperService: ShippersService,
    private readonly orderServerce: OrdersService,
    private readonly kitchenService: KitchenService,
    private readonly stationService: StationsService,
  ) {
    super(deliveryTripRepository);
  }

  async getAllDeliveryTrip(): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      relations: { shipper: true, kitchen: true, order: true, station: true },
    });
  }

  async getDeliveryTripByShipper(
    user: AccountEntity,
  ): Promise<DeliveryTripEntity[]> {
    return await this.deliveryTripRepository.find({
      where: { shipper: { id: user.id } },
      relations: {
        kitchen: true,
        order: true,
        station: true,
        time_slot: true,
      },
    });
  }

  async createDeliveryTrip(
    kitchen: AccountEntity,
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
    const newTrip = await this.deliveryTripRepository.save({
      status: DeliveryTripEnum.WAITING,
      deliveryDate: dto.deliveryDate,
      kitchen: kitchen,
      shipper: shipper,
      station: station,
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
      await this.orderServerce.transaction(callback, this.dataSource);
    }
    return await this.deliveryTripRepository.findOne({
      where: { id: newTrip.id },
      relations: {
        shipper: true,
        station: true,
        order: true,
      },
    });
  }

  // async updateStatusTrip()
}
