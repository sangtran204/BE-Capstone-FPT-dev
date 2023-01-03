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

@Injectable()
export class SessionService extends BaseService<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    private readonly kitchenService: KitchenService,
    private readonly timeSlotService: TimeSlotsService,
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
          orders: { packageItem: { foodGroup: { foods: true } } },
        },
      },
    });
    if (!sessionDetail || sessionDetail == null)
      throw new HttpException('No session found', HttpStatus.NOT_FOUND);
    return sessionDetail;
  }
}
