// import { ProfileModule } from './models/profiles/profile.module';
// import { ToursModule } from './models/tours/tours.module';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { JwtProviderModule } from './providers/jwt/provider.module';
import { Module } from '@nestjs/common';
import { RolesGuard } from './guards/role.guard';
// import { LocationCategoriesModule } from './models/location-categories/location-categories.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TestController } from 'src/app.controller';
import { AppConfigModule } from 'src/config/app/config.module';
import { AllExceptionsFilter } from 'src/exceptions/catch-all-exception.filter';
import { AccountsModule } from 'src/models/accounts/accounts.module';
// import { AutomapperProviderModule } from 'providers/automapper/provider.module';
import { MySQLDatabaseProviderModule } from 'src/providers/database/mysql/provider.module';
// import { SharedModule } from 'shared/shared.module';
// import { LocationsModule } from 'models/locations/locations.module';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { ProfileModule } from './models/profiles/profile.module';
// import { AuthModule } from './auth/auth.module';
// import { JwtProviderModule } from './providers/jwt/provider.module';
import { CategoriesModule } from './models/categories/categories.module';
// import { VehicleTypesModule } from 'models/vehicle-types/vehicle-types.module';
// import { FireBaseConfigModule } from 'config/firebase/config.module';
// import { ImagesModule } from 'models/images/images.module';
// import { TripsModule } from 'models/trips/trips.module';
// import { FirebaseProviderModule } from 'providers/firebase/provider.module';

@Module({
  imports: [
    AppConfigModule,
    MySQLDatabaseProviderModule,
    // JwtProviderModule,
    // AutomapperProviderModule,
    // AccountsModule,
    // ProfileModule,
    CategoriesModule,
    // SharedModule,
    // AuthModule,
    // LocationCategoriesModule,
    // LocationsModule,
    // ToursModule,
    // VehicleTypesModule,
    // FireBaseConfigModule,
    // ImagesModule,
    // TripsModule,
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
