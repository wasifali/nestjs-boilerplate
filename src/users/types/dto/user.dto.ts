import { IsEmail, IsMongoId, IsOptional, Max, Min } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class EmailDto {
  @ApiModelProperty({
    example: 'demo@serendipia.dev',
    format: 'demo@serendipia.dev',
    description: 'Must be an email!',
  })
  @IsEmail()
  email: string;
}
