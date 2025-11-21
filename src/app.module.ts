import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:secret@localhost:27017/travel_planner?authSource=admin',
    ),
    CountriesModule,
    TravelPlansModule,
  ],
})
export class AppModule {}
