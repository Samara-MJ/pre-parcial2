import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { TravelPlan } from './schemas/travel-plan.schema';

@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  create(@Body() dto: CreateTravelPlanDto): Promise<TravelPlan> {
    return this.travelPlansService.create(dto);
  }

  @Get()
  findAll(): Promise<TravelPlan[]> {
    return this.travelPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TravelPlan> {
    return this.travelPlansService.findOne(id);
  }
}
