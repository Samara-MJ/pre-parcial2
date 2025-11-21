import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiKeyGuard } from './guards/api-key-guards';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.countriesService.findByCode(code);
  }
  @UseGuards(ApiKeyGuard)
  @Delete(':code')
  async removeByCode(@Param('code') code: string) {
    await this.countriesService.removeByCode(code);
    return { message: 'Pais ${code.toUpperCase()} borrado del cache' };
  }
}
