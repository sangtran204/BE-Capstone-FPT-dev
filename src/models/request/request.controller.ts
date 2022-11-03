import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Query,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestEntity } from './entities/request.entity';
import { CreateRequestDTO } from './dto/create_request.dto';
import { Public } from 'src/decorators/public.decorator';
import { RequestFilterDTO } from './dto/request-filter.dto';
import { RejectReqDTO } from './dto/rejectReq.dto';
import { string } from 'joi';

@ApiBearerAuth()
@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get all request',
    type: RequestEntity,
  })
  async getAllRequest(): Promise<RequestEntity[]> {
    const list = await this.requestService.getAllRequest();
    if (!list || list.length == 0) {
      throw new HttpException('No request found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  @Get('/status')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Get request by status',
    type: RequestEntity,
  })
  async getRequesByStatus(
    @Query() reqFilter: RequestFilterDTO,
  ): Promise<RequestEntity[]> {
    const list = await this.requestService.getRequestByStatus(reqFilter);
    if (!list || list.length == 0) {
      throw new HttpException('No request found', HttpStatus.NOT_FOUND);
    } else {
      return list;
    }
  }

  @Post()
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Create request by kitchen',
    type: RequestEntity,
  })
  async createRequest(@Body() req: CreateRequestDTO): Promise<RequestEntity> {
    return this.requestService.createRequest(req);
  }

  @Put('/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Update status request',
    type: String,
  })
  async updateReqStatus(@Param('id') id: string): Promise<string> {
    return await this.requestService.updateReqStatus(id);
  }

  @Put('/reject/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Reject request',
    type: String,
  })
  async rejectRequest(
    @Param('id') id: string,
    @Body() reject: RejectReqDTO,
  ): Promise<string> {
    return await this.requestService.rejectRequest(id, reject);
  }

  @Delete('/:id')
  @Public()
  @ApiResponse({
    status: 200,
    description: 'Kitchen delete request',
    type: string,
  })
  async deleteRequest(@Param('id') id: string): Promise<string> {
    return await this.requestService.deleteRequest(id);
  }
}
