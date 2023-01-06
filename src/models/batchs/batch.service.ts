import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { BatchEnum } from 'src/common/enums/batch.enum';
import { OrderEnum } from 'src/common/enums/order.enum';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/order.service';
import { BatchEntity } from './entities/batch.entity';

@Injectable()
export class BatchService extends BaseService<BatchEntity> {
  constructor(
    @InjectRepository(BatchEntity)
    private readonly batchRepository: Repository<BatchEntity>,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
  ) {
    super(batchRepository);
  }

  // async createBatch(): Promise<BatchEntity> {
  //   const newBatch = await this.batchRepository.create();
  //   if (newBatch == null || !newBatch)
  //     throw new HttpException('Can not create batch', HttpStatus.BAD_REQUEST);
  //   return newBatch;
  // }

  async getBatchBySessionStation(
    sessionId: string,
    stationId: string,
  ): Promise<BatchEntity[]> {
    return await this.batchRepository.find({
      where: { session: { id: sessionId }, station: { id: stationId } },
      relations: { station: true, orders: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getBatchById(id: string): Promise<BatchEntity> {
    const batch = await this.batchRepository.findOne({
      where: { id: id },
      relations: {
        station: true,
        orders: {
          packageItem: { foodGroup: { foods: true } },
          subscription: { account: { profile: true } },
        },
      },
    });
    if (!batch || batch == null)
      throw new HttpException(`Batch id ${id} not found`, HttpStatus.NOT_FOUND);
    return batch;
  }
  async updateStatusBatch(id: string): Promise<string> {
    let status_update;
    const arrUpdateOrderPromise: Promise<OrderEntity>[] = [];
    const batchFind = await this.batchRepository.findOne({
      where: { id: id },
      relations: { orders: true },
    });
    if (!batchFind || batchFind == null)
      throw new HttpException('Batch not found', HttpStatus.BAD_REQUEST);
    if (batchFind.status == BatchEnum.READY) {
      await this.batchRepository.save({ id: id, status: BatchEnum.DELIVERY });
      batchFind.orders.map((o) => {
        arrUpdateOrderPromise.push(
          this.orderService.save({ id: o.id, status: OrderEnum.DELIVERY }),
        );
      });
      await Promise.all(arrUpdateOrderPromise);
      status_update = BatchEnum.DELIVERY;
    } else if (batchFind.status == BatchEnum.DELIVERY) {
      await this.batchRepository.save({ id: id, status: BatchEnum.ARRIVED });
      batchFind.orders.map((o) => {
        arrUpdateOrderPromise.push(
          this.orderService.save({ id: o.id, status: OrderEnum.ARRIVED }),
        );
      });
      await Promise.all(arrUpdateOrderPromise);
      status_update = BatchEnum.ARRIVED;
    } else if (
      batchFind.status == BatchEnum.WAITING ||
      batchFind.status == BatchEnum.ARRIVED
    ) {
      status_update = 'can not update';
    }
    return status_update;
  }
}
