// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { ConfigService } from '@nestjs/config';
// import { OAuth2Client } from 'google-auth-library';
// import { CustomerEntity } from 'src/models/customers/entities/customer.entity';
// import { google } from 'googleapis';
// import { GetAccessTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

// @Injectable()
// export class EmailService {
//   constructor(private configService: ConfigService) {}
//   async sendAccountUserConfirmation(
//     customer: CustomerEntity,
//     passwordRandom: string,
//   ): Promise<void> {
//     const CLIENT_ID: string = this.configService.get<string>('clientID');
//     const CLIENT_SECRET: string =
//       this.configService.get<string>('clientSecret');
//     const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
//     const REFRESH_TOKEN: string =
//       this.configService.get<string>('refreshTokenMail');
//     const oAuth2Client: OAuth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_SECRET,
//       REDIRECT_URI,
//     );
//     oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//     const accessToken: GetAccessTokenResponse =
//       await oAuth2Client.getAccessToken();

//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         customer: this.configService.get<string>('mailForm'),
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });

//     const mailOptions = {
//       from: this.configService.get<string>('mailForm'),
//       to: customer.account,
//       subject: 'Hello from gmail using API',
//       template: './confirmation',
//       context: {
//         name: customer.account,
//       },
//       html: `
//                 <h1>Hello from gmail email using API password: ${passwordRandom}</h1>
//             `,
//     };
//     await transport.sendMail(mailOptions);
//   }
// }
