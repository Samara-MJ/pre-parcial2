import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country, CountrySchema } from './schemas/country.schema';
import { HttpModule } from '@nestjs/axios';
import { RestCountriesProvider } from './providers/rest-countries.provider';

export const COUNTRY_INFO_PROVIDER = 'COUNTRY_INFO_PROVIDER';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
  ],
  controllers: [CountriesController],
  providers: [
    CountriesService,
    {
      provide: COUNTRY_INFO_PROVIDER,
      useClass: RestCountriesProvider,
    },
  ],
  exports: [CountriesService],
})
export class CountriesModule {}

