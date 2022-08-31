// import { MailerModule } from '@nestjs-modules/mailer';
// import { Module } from '@nestjs/common';
// import { join } from 'path';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// // import { config } from 'dotenv';
// import { ConfigModule } from '@nestjs/config';

// import { EmailService } from './email.service';

// // @config();
// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: process.env.MAIL_HOST,
//         secure: false,
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASSWORD,
//         },
//       },
//       defaults: {
//         from: `No Reply <${process.env.MAIL_FROM}>`,
//       },
//       template: {
//         dir: join(__dirname, '/templates'),
//         adapter: new HandlebarsAdapter(),
//         options: {
//           strict: true,
//         },
//       },
//     }),
//     ConfigModule,
//   ],
//   providers: [EmailService],
//   exports: [EmailService],
// })
// export class EmailModule {
//   constructor() {
//     //
//   }
// }
