import { OpportunityStatus } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateOpportunityDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  @IsISO8601()
  closeDate!: string;

  @IsEnum(OpportunityStatus)
  @IsNotEmpty()
  status!: OpportunityStatus;

  @IsNotEmpty()
  @IsString()
  contactId!: string;

  @IsNotEmpty()
  @IsString()
  companyId!: string;
}
