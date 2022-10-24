import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../accounts/entities/account.entity';
import { BaseService } from '../base/base.service';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
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
  ): Promise<string> {
    try {
      const checkEmail = await this.profileRepository.findOne({
        where: { email: dto.email },
      });
      if (Boolean(checkEmail) && user.id != checkEmail.id) {
        throw new HttpException(
          `Email ${dto.email} existed`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.profileRepository.update(
        {
          id: user.id,
        },
        {
          DOB: dto.DOB,
          fullName: dto.fullName,
          email: dto.email,
          // avatar: imgRes,
        },
      );
      return 'Profile update successfull';
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }

  async updateProfileAvatar(
    // dto: UpdateAvatarDTO,
    user: AccountEntity,
    avatar: Express.Multer.File,
  ): Promise<string> {
    try {
      const imgRes = await this.uploadImageToFirebase(avatar);
      await this.profileRepository.update(
        {
          id: user.id,
        },
        {
          avatar: imgRes,
        },
      );
      return 'Profile update successfull';
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }
}
