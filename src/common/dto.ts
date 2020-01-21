import {
  IsDefined,
  IsHexadecimal,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { JwtInterface } from './interfaces';

export class IdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  // tslint:disable-next-line:variable-name
  _id: string;
}

export class CompanyIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  companyId: string;
}

export class ProjectIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  projectId: string;
}

export class UserIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  userId: string;
}

export class CompanyIdDtoOptional {
  @ApiModelPropertyOptional({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsOptional()
  @IsMongoId()
  companyId: string;
}

export class PostIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  postId: string;
}

export class UserIdAndCompanyIdDto extends UserIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  companyId: string;
}

export class InvitationIdDto {
  @ApiModelProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  invitationId: string;
}

export class JwtDto {
  @ApiModelProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
      '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
      '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsString()
  @IsNotEmpty()
  jwt: string;

  constructor(data?: JwtInterface) {
    if (data) {
      this.jwt = data.jwt;
    }
  }
}
