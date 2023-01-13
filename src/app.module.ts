import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/role.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AppConfigModule } from 'src/config/app/config.module';
import { AllExceptionsFilter } from 'src/exceptions/catch-all-exception.filter';
import { AccountsModule } from 'src/models/accounts/accounts.module';
import { AutomapperProviderModule } from './providers/automapper/provider.module';
import { MySQLDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
import { FireBaseConfigModule } from './config/firebase/config.module';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { FoodCategoriesModule } from './models/food-categories/food-categories.module';
import { FoodsModule } from './models/foods/foods.module';
import { FoodGroupModule } from './models/food-group/food-group.module';
import { StationsModule } from './models/stations/stations.module';
import { AuthModule } from './auth/auth.module';
import { JwtProviderModule } from './providers/jwt/provider.module';
import { TimeSlotsModule } from './models/time-slots/time-slots.module';
import { PackagesModule } from './models/packages/packages.module';
import { KitchenModule } from './models/kitchens/kitchens.module';
import { DeliveryTripModule } from './models/deliveryTrips/deliveryTrip.module';
import { PackageItemModule } from './models/package-item/package-item.module';
import { ProfileModule } from './models/profiles/profile.module';
import { SharedModule } from './shared/shared.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShippersModule } from './models/shippers/shippers.module';
import { OrdersModule } from './models/orders/order.module';
import { FirebaseProviderModule } from './providers/firebase/provider.module';
import { PackageCategoriesModule } from './models/package-categories/package-categories.module';
import { SubscriptionModule } from './models/subscriptions/subscriptions.module';
import { FeedBackModule } from './models/feedback/feedback.module';
import { VnpayProviderModule } from './providers/vnpay/vnpay.module';
import { TestController } from './app.controller';
import { SessionModule } from './models/sessions/sessions.module';
import { BatchModule } from './models/batchs/batch.module';
import { GoongMapConfigModule } from './config/goong-map/config.module';

@Module({
  imports: [
    AppConfigModule,
    MySQLDatabaseProviderModule,
    JwtProviderModule,
    AutomapperProviderModule,
    FireBaseConfigModule,
    AccountsModule,
    ProfileModule,
    SharedModule,
    AuthModule,
    ShippersModule,
    KitchenModule,
    FoodCategoriesModule,
    FoodsModule,
    FoodGroupModule,
    PackagesModule,
    PackageItemModule,
    StationsModule,
    TimeSlotsModule,
    PackageCategoriesModule,
    SubscriptionModule,
    // ====================================
    OrdersModule,
    FirebaseProviderModule,
    DeliveryTripModule,
    FeedBackModule,
    VnpayProviderModule,
    SessionModule,
    BatchModule,
    GoongMapConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [TestController],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
