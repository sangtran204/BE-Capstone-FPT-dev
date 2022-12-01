import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BanksService } from './banks.service';
import { BankEntity } from './entities/bank.entity';
import { Public } from '../../decorators/public.decorator';
import { MapInterceptor } from '@automapper/nestjs';
import { BankDto } from './dto/bank.dto';

@Controller('banks')
@ApiTags('banks')
@ApiBearerAuth()
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @Public()
  @UseInterceptors(MapInterceptor(BankEntity, BankDto, { isArray: true }))
  async getBanks(): Promise<BankEntity[]> {
    return this.banksService.query();
  }
}
