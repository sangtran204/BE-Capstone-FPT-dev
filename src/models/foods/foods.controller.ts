import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { ImagesUploadDto } from '../images/dto/images-upload.dto';
import { FoodDTO } from './dto/food.dto';
import { FoodEntity } from './entities/foods.entity';
import { FoodsService } from './foods.service';

@ApiBearerAuth()
@ApiTags('foods')
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Public()
  @Get()
  @ApiResponse({
    status: 200,
    description: 'GET ALL FOOD',
    type: [FoodDTO],
  })
  async findAll(): Promise<FoodEntity[]> {
    const listFood = await this.foodsService.getAllFood();
    if (!listFood || listFood.length == 0) {
      throw new HttpException(
        "Dont't have resource food",
        HttpStatus.NOT_FOUND,
      );
    }
    return listFood;
  }

  @Public()
  @Get('/getAllActiveFood')
  @ApiResponse({
    status: 200,
    description: 'GET ALL ACTIVE FOOD',
    type: [FoodDTO],
  })
  async findAllActiveFood(): Promise<FoodEntity[]> {
    const listFood = await this.foodsService.getAllActiveFood();
    if (!listFood || listFood.length == 0) {
      throw new HttpException(
        "Dont't have resource active food",
        HttpStatus.NOT_FOUND,
      );
    }
    return listFood;
  }

  // @Public()
  // @Post('/images/:id')
  // @UseInterceptors(FilesInterceptor('images'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'List image',
  //   type: ImagesUploadDto,
  // })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Upload Images Successfully',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Upload Images fail',
  // })
  // async addImagesFood(
  //   @Param('id') id: string,
  //   @UploadedFiles() images: Array<Express.Multer.File>,
  // ): Promise<string> {
  //   return await this.foodsService.addImagesFood(id, images);
  // }

  // Create
  @Public()
  @Post('/createFood')
  // @UseInterceptors(FilesInterceptor('images'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'List Created Food',
  //   type: CreateFoodDTO,
  // })
  @ApiResponse({
    status: 200,
    description: 'Create new food successfully',
    type: FoodDTO,
  })
  // @UseInterceptors(MapInterceptor(FoodDTO, FoodEntity))
  async createFood(
    @Body() createFoodDTO: FoodDTO,
    // @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<FoodEntity> {
    return await this.foodsService.createFood(createFoodDTO);
  }

  // Update
  @Put('/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Update category successfully',
    type: String,
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: FoodDTO,
  ): Promise<string> {
    return await this.foodsService.updateFood(id, dto);
  }

  // Remove Food = Update status
  @Public()
  @Put('/removeFood/:id')
  @ApiResponse({
    status: 200,
    description: 'Remove Food STATUS',
    type: String,
  })
  async deleteKitchen(@Param('id') id: string): Promise<string> {
    return await this.foodsService.removeFood(id);
  }
}
