import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country, CountrySchema } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/rest-countries.provider';
import { TravelPlansModule } from 'src/travel-plans/travel-plans.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    forwardRef(() => TravelPlansModule),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, RestCountriesProvider],
  exports: [CountriesService],
})
export class CountriesModule {}
