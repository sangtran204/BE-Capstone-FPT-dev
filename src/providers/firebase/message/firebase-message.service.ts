import { Injectable } from '@nestjs/common';
import { messaging } from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import {
  MessagingDevicesResponse,
  MessagingPayload,
} from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FirebaseMessageService {
  sendCustomNotification(
    registrationTokenOrTokens: string | string[],
    title: string,
    body: string,
    data: { [key: string]: string },
  ): Promise<MessagingDevicesResponse> {
    const message: MessagingPayload = {
      data: data,
      notification: {
        title,
        body,
      },
    };
    return messaging().sendToDevice(registrationTokenOrTokens, message);
  }

  getMessaging(): Messaging {
    return messaging();
  }
}
