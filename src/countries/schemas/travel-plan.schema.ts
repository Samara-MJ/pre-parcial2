import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelPlanDocument = TravelPlan & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class TravelPlan {
  @Prop({ required: true, uppercase: true })
  countryCode: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  notes?: string;
}

export const TravelPlanSchema = SchemaFactory.createForClass(TravelPlan);
