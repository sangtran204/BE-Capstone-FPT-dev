import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { MapInterceptor } from '@automapper/nestjs';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileDTO } from './dto/profile.dto';
import { GetUser } from '../../decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Controller('profiles')
@ApiTags('profiles')
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfileService) {}

  @Get('/my')
  // @UseInterceptors(MapInterceptor(ProfileEntity, ProfileDTO))
  getMe(@GetUser() user: AccountEntity): AccountEntity {
    return user;
  }

  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  // @UseInterceptors(MapInterceptor(ProfileEntity, UpdateProfileDTO))
  async updateProfile(
    @Body() dto: UpdateProfileDTO,
    @GetUser() user: AccountEntity,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<string> {
    return await this.profilesService.updateProfile(dto, user, avatar);
  }
}
