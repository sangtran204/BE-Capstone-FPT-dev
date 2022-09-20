import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { KitchenEntity } from './entities/kitchens.entity';
import { KitchenDTO } from './dto/kitchen.dto';
import { StatusEnum } from 'src/common/enums/status.enum';

@Injectable()
export class KitchenService extends BaseService<KitchenEntity> {
  constructor(
    @InjectRepository(KitchenEntity)
    private readonly kitchensRepository: Repository<KitchenEntity>,
  ) {
    super(kitchensRepository);
  }

  async getAllKitchen(): Promise<KitchenEntity[]> {
    return await this.kitchensRepository.find();
  }

  async createKitchen(dto: KitchenDTO): Promise<KitchenEntity> {
    try {
      return await this.kitchensRepository.save({
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async updateKitchen(id: string, dto: KitchenDTO): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      try {
        await this.kitchensRepository.update(
          { id: id },
          {
            name: dto.name,
            address: dto.address,
            phone: dto.phone,
          },
        );
        return 'Update package succesfull';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async deleteKitchen(id: string): Promise<string> {
    const kitchen = await this.kitchensRepository.findOne({
      where: { id: id },
    });
    if (!kitchen) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      try {
        await this.kitchensRepository.update(
          { id: id },
          { status: StatusEnum.IN_ACTIVE },
        );
        return 'Kitchen inActive';
      } catch (error) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
