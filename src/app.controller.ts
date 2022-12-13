// import { MessagingDevicesResponse } from 'firebase-admin/messaging';
import { Controller, Get, Query, Req, Render } from '@nestjs/common';
// import { GoongMapsService } from 'shared/goong-maps.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AccountsService } from './models/accounts/accounts.service';
import { VnpayService } from './providers/vnpay/vnpay.service';
// import { Public } from 'decorators/public.decorator';
// import { FirebaseMessageService } from 'providers/firebase/message/firebase-message.service';
import { Request } from 'express';
import { VnpayDto } from './providers/vnpay/vnpay.dto';
@ApiBearerAuth()
@Controller('test')
@ApiTags('app')
export class TestController {
  constructor(
    private readonly accountService: AccountsService, // private readonly firebaseMessage: FirebaseMessageService,
    private readonly vnpay: VnpayService,
  ) {}

  @Get('/vnpay')
  @Public()
  payment(@Req() req: Request): string {
    const ip =
      req.header('x-forwarded-for') ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    const url = this.vnpay.payment(ip, 1000000, 'NCB', 'test thu', 'other', '');
    return url;
  }

  @Get('/return')
  @Public()
  vnpayReturn(@Query() vnpayDto: VnpayDto): { message: string; code: string } {
    return this.vnpay.returnUrl(vnpayDto);
  }

  @Get('/abc')
  @Public()
  @Render('index')
  root1(): { result: { isSuccess: boolean; message: string } } {
    return { result: { isSuccess: true, message: 'hello wolrd' } };
  }
}
