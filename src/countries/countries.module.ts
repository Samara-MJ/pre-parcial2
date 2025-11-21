import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country, CountrySchema } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/rest-countries.provider';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, RestCountriesProvider],
  exports: [CountriesService],
})
export class CountriesModule {}
