import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { FeedBackEntity } from './entities/feedback.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
import { CreateFeedbackDTO } from './dto/create_feedback.dto';
import { PackageService } from '../packages/packages.service';

@Injectable()
export class FeedBackService extends BaseService<FeedBackEntity> {
  constructor(
    @InjectRepository(FeedBackEntity)
    private readonly feedbackRepository: Repository<FeedBackEntity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly packageService: PackageService,
  ) {
    super(feedbackRepository);
  }

  async createFeedBack(
    dto: CreateFeedbackDTO,
    user: AccountEntity,
  ): Promise<string> {
    const packageFind = await this.packageService.findOne({
      where: { id: dto.packageId },
    });
    if (!packageFind)
      throw new HttpException('Package not found', HttpStatus.NOT_FOUND);
    const newFeedback = await this.feedbackRepository.save({
      packageRate: dto.packageRate,
      foodRate: dto.foodRate,
      deliveryRate: dto.deliveryRate,
      comment: dto.comment,
      packages: packageFind,
      customer: user,
    });
    if (newFeedback) {
      return 'Send feedback success';
    } else {
      return 'Send feedback fail';
    }
  }

  async getFeedbackByPackage(packageId: string): Promise<FeedBackEntity[]> {
    const packageFind = await this.packageService.findOne({
      where: { id: packageId },
    });

    if (!packageFind)
      throw new HttpException('Package not found', HttpStatus.NOT_FOUND);
    const listFeedback = await this.feedbackRepository.find({
      where: { packages: { id: packageId } },
      relations: { customer: { account: { profile: true } }, packages: true },
    });
    if (!listFeedback || listFeedback.length == 0) {
      throw new HttpException('No feedback found', HttpStatus.NOT_FOUND);
    }
    return listFeedback;
  }

  async getAllFeedback(): Promise<FeedBackEntity[]> {
    const list = await this.feedbackRepository.find({
      relations: { customer: { account: { profile: true } }, packages: true },
    });
    if (!list || list.length == 0) {
      throw new HttpException('No feedback found', HttpStatus.NOT_FOUND);
    }
    return list;
  }
}
