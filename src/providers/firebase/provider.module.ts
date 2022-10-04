import { FirebaseMessageService } from './message/firebase-message.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [FirebaseMessageService],
  exports: [FirebaseMessageService],
})
export class FirebaseProviderModule {}
