import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/rest-countries.provider';
import { TravelPlan, TravelPlanDocument } from './schemas/travel-plan.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private readonly countryModel: Model<CountryDocument>,
    @InjectModel(TravelPlan.name)
    private readonly travelPlanModel: Model<TravelPlanDocument>,
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
  async removeByCode(code: string): Promise<void> {
    const c = code.toUpperCase();

    // Verificar que el país existe
    const country = await this.countryModel.findOne({ code: c });
    if (!country) {
      throw new NotFoundException(`El país ${c} no existe en la caché.`);
    }

    // Verificar que no existan TravelPlans asociados
    const plansCount = await this.travelPlanModel.countDocuments({
      countryCode: c,
    });
    if (plansCount > 0) {
      throw new BadRequestException(
        `No se puede borrar ${c} porque existen planes de viaje asociados.`,
      );
    }

    // borrar
    await this.countryModel.deleteOne({ code: c });
  }
}
