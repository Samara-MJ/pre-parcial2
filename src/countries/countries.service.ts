import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { COUNTRY_INFO_PROVIDER } from './countries.module';
import { RestCountriesProvider } from './providers/rest-countries.provider';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    @Inject(COUNTRY_INFO_PROVIDER)
    private readonly restCountries: RestCountriesProvider,
  ) {}

  async findAll() {
    return this.countryModel.find().sort({ name: 1 }).exec();
  }

  async findByCode(code: string) {
    const c = code.toUpperCase();

    let country = await this.countryModel.findOne({ code: c });

    if (country) {
      return { ...country.toObject(), source: 'cache' };
    }

    const external = await this.restCountries.getCountryByCode(c);

    if (!external) {
      throw new NotFoundException(`Country ${c} not found`);
    }

    country = await this.countryModel.create(external);

    return { ...country.toObject(), source: 'api' };
  }
}

