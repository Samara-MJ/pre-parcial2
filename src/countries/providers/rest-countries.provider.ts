import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RestCountriesProvider {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  constructor(private readonly http: HttpService) {}

  async getCountryByCode(code: string) {
    try {
      const url = `${this.baseUrl}/alpha/${code}?fields=cca3,name,region,subregion,capital,population,flags`;
      const { data } = await firstValueFrom(this.http.get(url));

      const c = Array.isArray(data) ? data[0] : data;

      if (!c) return null;

      return {
        code: c.cca3,
        name: c.name?.common,
        region: c.region,
        subregion: c.subregion,
        capital: c.capital?.[0] ?? '',
        population: c.population,
        flagUrl: c.flags?.png ?? '',
      };
    } catch (e) {
      if (e.response?.status === 404) return null;

      throw new HttpException(
        'External service error',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
