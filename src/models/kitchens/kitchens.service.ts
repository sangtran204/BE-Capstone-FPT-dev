import { DataSource, EntityManager, Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { KitchenEntity } from './entities/kitchens.entity';
import { ProfileService } from '../profiles/profile.service';
import { UpdateKitchenDTO } from './dto/update_kitchen.dto';
import { ProfileEntity } from '../profiles/entities/profile.entity';
import { AccountEntity } from '../accounts/entities/account.entity';
import { StatusEnum } from 'src/common/enums/status.enum';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class KitchenService extends BaseService<KitchenEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(KitchenEntity)
    private readonly kitchensRepository: Repository<KitchenEntity>,
    private readonly profileService: ProfileService,
    private readonly accountService: AccountsService,
  ) {
    super(kitchensRepository);
  }

  async findAll(): Promise<KitchenEntity[]> {
    return await this.kitchensRepository.find({
      relations: {
        account: true,
      },
    });
  }

  async updateKitchen(
    id: string,
    update: UpdateKitchenDTO,
  ): Promise<KitchenEntity> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`Kitchen ${id} not found`, HttpStatus.NOT_FOUND);
    }

    const checkEmail = await this.profileService.findOne({
      where: { email: update.email },
    });
    if (Boolean(checkEmail) && id != checkEmail.id) {
      throw new HttpException(
        `Email ${update.email} existed`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const callback = async (entityManager: EntityManager): Promise<void> => {
      await entityManager.update(
        KitchenEntity,
        { id: id },
        { address: update.address, ability: update.ability },
      );
      await entityManager.update(
        ProfileEntity,
        { id: id },
        { fullName: update.fullName, email: update.email },
      );
    };
    await this.profileService.transaction(callback, this.dataSource);
    return await this.kitchensRepository.findOne({
      where: { id: id },
      relations: { account: { profile: true } },
    });
  }

  async updateStatusKitchen(id: string): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
      relations: { account: true },
    });
    if (!kitchen) {
      throw new HttpException(`Kitchen ${id} not found`, HttpStatus.NOT_FOUND);
    }

    if (kitchen.account.status == StatusEnum.ACTIVE) {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Kitchen inactive!';
    } else {
      const callback = async (entityManager: EntityManager): Promise<void> => {
        await entityManager.update(
          AccountEntity,
          { id: id },
          { status: StatusEnum.ACTIVE },
        );
      };
      await this.accountService.transaction(callback, this.dataSource);
      return 'Kitchen active!';
    }
  }
}
