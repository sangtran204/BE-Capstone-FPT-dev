import { SeederModule } from './database/seeds/seeder.module';
import { NestFactory } from '@nestjs/core';
import { Seeder } from './database/seeds/seeder';
async function bootstrap(): Promise<void> {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  const seeder = appContext.get(Seeder);
  try {
    await seeder.insertRoles();
    await seeder.insertAccount();
    await seeder.insertTimeSlot();
    // await seeder.insertTimeFrame();
    await seeder.insertBank();
  } catch (error) {
    console.error(error);
  } finally {
    appContext.close();
  }
}

bootstrap();
