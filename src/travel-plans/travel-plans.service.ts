import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TravelPlan,
  TravelPlanDocument,
} from '../countries/schemas/travel-plan.schema';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectModel(TravelPlan.name)
    private readonly travelPlanModel: Model<TravelPlanDocument>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(dto: CreateTravelPlanDto): Promise<TravelPlan> {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid dates');
    }

    if (end < start) {
      throw new BadRequestException('endDate must be after startDate');
    }

    // Valida que el país exista usando la lógica de CountriesService
    await this.countriesService.findByCode(dto.countryCode);

    const plan = await this.travelPlanModel.create({
      countryCode: dto.countryCode.toUpperCase(),
      title: dto.title,
      startDate: start,
      endDate: end,
      notes: dto.notes,
    });

    return plan;
  }

  async findAll(): Promise<TravelPlan[]> {
    return this.travelPlanModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<TravelPlan> {
    const plan = await this.travelPlanModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(`Travel plan with id ${id} not found`);
    }
    return plan;
  }
}
