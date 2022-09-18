// import { ProfileModule } from './models/profiles/profile.module';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { JwtProviderModule } from './providers/jwt/provider.module';
import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/role.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
// import { TestController } from 'src/app.controller';
import { AppConfigModule } from 'src/config/app/config.module';
import { AllExceptionsFilter } from 'src/exceptions/catch-all-exception.filter';
// import { AccountsModule } from 'src/models/accounts/accounts.module';
import { AutomapperProviderModule } from './providers/automapper/provider.module';
import { MySQLDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
import { FireBaseConfigModule } from './config/firebase/config.module';
// import { SharedModule } from 'shared/shared.module';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
// import { ProfileModule } from './models/profiles/profile.module';
// import { AuthModule } from './auth/auth.module';
import { FoodCategoriesModule } from './models/food-categories/food-categories.module';
import { FoodsModule } from './models/foods/foods.module';
import { FoodGroupItemModule } from './models/food-group-item/food-group-item.module';
import { FoodGroupModule } from './models/food-group/food-group.module';
import { PackageItemFoodModule } from './models/package-item-food/package-item-food.module';
import { StationsModule } from './models/stations/stations.module';

import { ShippersModule } from './models/shippers/shippers.module';
import { TimeSlotsModule } from './models/timeSlots/timeSlots.module';
import { PackagesModule } from './models/packages/packages.module';
// import { ImagesModule } from './models/images/images.module';
import { KitchenModule } from './models/kitchens/kitchens.module';
import { DeliveryTripModule } from './models/deliveryTrips/deliveryTrip.module';
import { MealModule } from './models/meals/meals.module';
import { StationPackageItemModule } from './models/stationPackageItem/stationPackageItem.module';
import { PackageItemModule } from './models/package-item/packageItem.module';

// import { FirebaseProviderModule } from 'providers/firebase/provider.module';

@Module({
  imports: [
    AppConfigModule,
    MySQLDatabaseProviderModule,
    // JwtProviderModule,
    AutomapperProviderModule,
    FireBaseConfigModule,
    // AccountsModule,
    // ProfileModule,
    FoodCategoriesModule,
    FoodsModule,
    FoodGroupItemModule,
    FoodGroupModule,
    PackageItemFoodModule,
    StationsModule,

    DeliveryTripModule,
    ShippersModule, //-> update
    TimeSlotsModule, //-> update
    PackagesModule, //-> update
    KitchenModule, //-> update
    MealModule,
    StationPackageItemModule,
    PackageItemModule,
    // SharedModule,
    // AuthModule,
    // ImagesModule,
    // FirebaseProviderModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
