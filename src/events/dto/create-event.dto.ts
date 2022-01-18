import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  venue: string;

  @IsNotEmpty()
  description: string;

  @IsDateString()
  date: Date;

  @IsNotEmpty({ message: 'Please add valid time' })
  time: string;

  @ApiProperty({ type: 'file' })
  image: Express.Multer.File;
}
