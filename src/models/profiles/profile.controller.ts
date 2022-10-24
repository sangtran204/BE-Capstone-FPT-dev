import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { GetUser } from '../../decorators/user.decorator';
import { AccountEntity } from '../accounts/entities/account.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import { UpdateAvatarDTO } from './dto/update-avatar.dto';

@Controller('profiles')
@ApiTags('profiles')
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfileService) {}

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Update profile',
    type: String,
  })
  async updateProfile(
    @Body() dto: UpdateProfileDTO,
    @GetUser() user: AccountEntity,
  ): Promise<string> {
    return await this.profilesService.updateProfile(dto, user);
  }

  @Put('avatar')
  @ApiResponse({
    status: 200,
    description: 'Update avatar',
    type: String,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  async updateProfileAvatar(
    @Body() dto: UpdateAvatarDTO,
    @GetUser() user: AccountEntity,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<string> {
    return await this.profilesService.updateProfileAvatar(user, avatar);
  }
}
