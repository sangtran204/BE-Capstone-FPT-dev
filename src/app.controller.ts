import { Controller, Get, Query, Req, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { VnpayService } from './providers/vnpay/vnpay.service';
import { Request } from 'express';
import { VnpayDto } from './providers/vnpay/vnpay.dto';
import { GetUser } from './decorators/user.decorator';
import { AccountEntity } from './models/accounts/entities/account.entity';
import { FirebaseMessageService } from './providers/firebase/message/firebase-message.service';
@ApiBearerAuth()
@Controller('test')
@ApiTags('app')
export class TestController {
  constructor(
    private readonly vnpay: VnpayService,
    private readonly firebaseMessage: FirebaseMessageService,
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

  @Post()
  async testNotify(@GetUser() user: AccountEntity): Promise<string> {
    if (user.deviceToken === null) {
      return 'sorry you can not device token';
    }
    await this.firebaseMessage.getMessaging().sendToDevice(user.deviceToken, {
      data: {
        title: 'hello',
      },
      notification: {
        title: 'xin chao',
        body: 'haha',
      },
    });
    return 'send notification success';
  }

  @Get('/return')
  @Public()
  vnpayReturn(@Query() vnpayDto: VnpayDto): { message: string; code: string } {
    return this.vnpay.returnUrl(vnpayDto);
  }

  // @Get('/abc')
  // @Public()
  // @Render('index')
  // root1(): { result: { isSuccess: boolean; message: string } } {
  //   return { result: { isSuccess: true, message: 'hello wolrd' } };
  // }
}
