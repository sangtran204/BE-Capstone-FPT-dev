import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { ProfileDTO } from './dto/profile.dto';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService extends BaseService<ProfileEntity> {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {
    super(profileRepository);
  }

  async updateProfile(
    dto: UpdateProfileDTO,
    user: AccountEntity,
    avatar: Express.Multer.File,
  ): Promise<string> {
    const imgRes = await this.uploadImageToFirebase(avatar);
    await this.profileRepository.update(
      {
        id: user.id,
      },
      {
        DOB: dto.DOB,
        fullName: dto.fullName,
        email: dto.email,
        avatar: imgRes,
      },
    );
    return 'Profile update successfull';
  }
}
