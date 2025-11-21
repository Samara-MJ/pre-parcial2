import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelPlansService } from './travel-plans.service';
import { TravelPlansController } from './travel-plans.controller';
import {
  TravelPlan,
  TravelPlanSchema,
} from '../countries/schemas/travel-plan.schema';
import { CountriesModule } from '../countries/countries.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TravelPlan.name, schema: TravelPlanSchema },
    ]),
    forwardRef(() => CountriesModule), // para usar CountriesService
  ],
  controllers: [TravelPlansController],
  providers: [TravelPlansService],
})
export class TravelPlansModule {}
