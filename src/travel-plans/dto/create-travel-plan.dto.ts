import {
  IsNotEmpty,
  IsString,
  Length,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  @Length(3, 3)
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
