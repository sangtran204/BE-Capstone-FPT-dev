import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReqStatusEnum } from 'src/common/enums/request.enum';
import { Like, Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { KitchenService } from '../kitchens/kitchens.service';
import { CreateRequestDTO } from './dto/create_request.dto';
import { RejectReqDTO } from './dto/rejectReq.dto';
import { RequestFilterDTO } from './dto/request-filter.dto';
import { RequestEntity } from './entities/request.entity';
@Injectable()
export class RequestService extends BaseService<RequestEntity> {
  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestRepository: Repository<RequestEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly kitchenService: KitchenService,
  ) {
    super(requestRepository);
  }

  //List tất cả request
  async getAllRequest(): Promise<RequestEntity[]> {
    return await this.requestRepository.find({ relations: { kitchen: true } });
  }

  //Kitchen get request

  async getRequestByKitchen(user: AccountEntity): Promise<RequestEntity[]> {
    const kitchen = await this.kitchenService.findOne({
      where: { id: user.id },
    });
    if (!kitchen) {
      throw new HttpException(
        `Kitchen ${user.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      const list = await this.requestRepository
        .createQueryBuilder('request')
        .where('request.kitchenId = :kitchenId', { kitchenId: user.id })
        .getMany();
      return list;
    }
  }

  //List request theo status
  async getRequestByStatus(
    statusFilter: RequestFilterDTO,
  ): Promise<RequestEntity[]> {
    const { status } = statusFilter;
    return await this.requestRepository.find({
      where: { status: Like(Boolean(status) ? status : '%%') },
      relations: { kitchen: true },
    });
  }

  //Cập nhật trạng thái request
  async updateReqStatus(requestId: string): Promise<string> {
    const req = await this.requestRepository.findOne({
      where: { id: requestId },
    });
    if (!req) {
      throw new HttpException(
        `Request ${requestId} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (req.status == ReqStatusEnum.WAITING) {
        await this.requestRepository.update(
          { id: requestId },
          { status: ReqStatusEnum.PENDING },
        );
        return 'Request is pending';
      } else if (req.status == ReqStatusEnum.PENDING) {
        await this.requestRepository.update(
          { id: requestId },
          { status: ReqStatusEnum.PROCESSED },
        );
        return 'Request is processed';
      }
    }
  }

  //Tạo request
  async createRequest(
    req: CreateRequestDTO,
    user: AccountEntity,
  ): Promise<RequestEntity> {
    const kitchenFind = await this.kitchenService.findOne({
      where: { id: user.id },
    });
    if (!kitchenFind) {
      throw new HttpException(
        `Kitchen ${user.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else if (req.numberReq <= 0 || req.numberReq > 5) {
      throw new HttpException(
        'Number request cannot be less or equal to 0 or more than 5',
        HttpStatus.BAD_REQUEST,
      );
    } else if (req.reason.length == 0) {
      throw new HttpException('Reason cannot null', HttpStatus.BAD_REQUEST);
    } else {
      return await this.requestRepository.save({
        reason: req.reason,
        numberReq: req.numberReq,
        kitchen: kitchenFind,
      });
    }
  }

  //Từ chối request
  async rejectRequest(
    requestId: string,
    reject: RejectReqDTO,
  ): Promise<string> {
    const req = await this.requestRepository.findOne({
      where: { id: requestId },
    });
    if (!req) {
      throw new HttpException(
        `Request ${requestId} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.requestRepository.update(
        { id: requestId },
        { rejectReason: reject.rejectReason, status: ReqStatusEnum.REJECT },
      );
      return 'Request rejected';
    }
  }

  //Kitchen xóa request
  async deleteRequest(requestId: string): Promise<string> {
    const req = await this.requestRepository.findOne({
      where: { id: requestId },
    });
    if (!req) {
      throw new HttpException(
        `Request ${requestId} not found`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (req.status == ReqStatusEnum.WAITING) {
        try {
          await this.requestRepository
            .createQueryBuilder()
            .delete()
            .from(RequestEntity)
            .where('id = :id', { id: requestId })
            .execute();
          return 'Request deleted';
        } catch (error) {
          throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
      } else {
        return 'Can not delete request';
      }
    }
  }
}
