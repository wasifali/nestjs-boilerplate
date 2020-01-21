import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Platform } from '../../../common/enum';
import { JwtDto } from '../../../common/dto';

export class LoginDto {
  // decorator for API Documentation!
  @ApiModelProperty({ example: 'demo@serendipia.dev' })
  // validation decorator to check for an email field!
  @IsEmail()
  readonly email: string;

  // decorator for API Documentation!
  @ApiModelProperty({ example: 'workydemo' })
  // validation decorators for password field!
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  constructor(credentials: CredentialsInterface) {
    if (credentials) {
      this.email = credentials.email;
      this.password = credentials.password;
    }
  }
}

export interface CredentialsInterface {
  email: string;
  password: string;
}

export class ForgotPasswordDto {
  // decorator for API Documentation!
  @ApiModelProperty({ example: 'admin@serendipia.dev' })
  // validation decorator to check for an email field!
  @IsEmail()
  readonly email: string;
}

export class ResetPasswordDto {
  // decorator for API Documentation!
  @ApiModelProperty({ example: 'admin@serendipia.dev' })
  // validation decorator to check for an email field!
  @IsEmail()
  readonly email: string;

  // decorator for API Documentation!
  @ApiModelProperty({ example: '547893' })
  @IsNotEmpty()
  @IsNumberString()
  code: string;

  // decorator for API Documentation!
  @ApiModelProperty({
    minLength: 8,
    maxLength: 64,
    example: 'workydemo',
  })
  // validation decorators for password field!
  @IsString()
  @Length(8, 64)
  readonly password: string;

  // decorator for API Documentation!
  @ApiModelProperty({
    minLength: 8,
    maxLength: 64,
    example: 'workydemo',
  })
  // validation decorators for confirm password field!
  @IsString()
  @Length(8, 64)
  confirmPassword: string;
}

export class RegisterDto {
  // decorator for API Documentation!
  @ApiModelProperty({
    uniqueItems: true,
    example: 'demo@serendipia.dev',
  })
  // validation decorator to check for an email field!
  @IsEmail()
  email: string;

  // decorator for API Documentation!
  @ApiModelProperty({
    minLength: 8,
    maxLength: 64,
    example: 'workydemo',
  })
  // validation decorators for password field!
  @IsString()
  @Length(8, 64)
  password: string;

  // decorator for API Documentation!
  @ApiModelProperty({
    format: 'Only Capital, Small English Letters And Spaces!',
    example: 'serendipia Demo',
  })
  // validation decorator for firstName field!
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z ]+$/i, {
    message: () => {
      return 'fullName must contains only alphabets and spaces!';
    },
  })
  fullName: string;

  // validation decorator for avatar
  @IsOptional()
  @IsString()
  @ApiModelPropertyOptional({
    format: 'avatar file name complete with extension',
    example: 'avatar_1572695366655_cx1e_Talha%2BMasood.png',
  })
  avatar: string;

  constructor(user: RegisterInterface) {
    if (user) {
      this.email = user.email;
      this.password = user.password;
      this.fullName = user.fullName;
      this.avatar = user.avatar;
    }
  }
}

export class GoogleLoginDto {
  @ApiModelProperty({
    example:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEwNjgyNGI3OWUzOTgyMzk0ZDVjZTdhYzc1YmY5MmNiYTMwYTJlMjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiODg0MDQ3MzU1NTY1LTRuZXI0NXNqNjYxdTAydnE2MzhzMWUwZ200bnFzMWZiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiODg0MDQ3MzU1NTY1LTRuZXI0NXNqNjYxdTAydnE2MzhzMWUwZ200bnFzMWZiLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MzExNjY2MDI3NzQ5MTkxNzg4IiwiZW1haWwiOiJjbWFmemFhbGFobWFkQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiWVl6dHd4bGliMGw0QWctQnBhQXY0USIsIm5hbWUiOiJBZnphYWwgQWhtYWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1oeXhGM0RvS2RiZy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JkY0JxVzVCRUJHamdFUUZwLXhWZVJJTzNGOHJ3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJBZnphYWwiLCJmYW1pbHlfbmFtZSI6IkFobWFkIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1NzM0ODI0NzgsImV4cCI6MTU3MzQ4NjA3OCwianRpIjoiZTNhNjE2YTcxNTA2NzkzNWEwOWNmYjdhNzQzZDYwNzFjYTJjMjgzYyJ9.jMfEDbhpyibYTiaPLXoY9H-YmWjfNs3XFeR8VVDT8ByMOqsIRgcYko7BOKI1-If4tm2iD7GIZIfCOLr3opojT2kOp2qjU5PA71TTLeZuTwJOvpFtZVXLOLQmtVJx_2FZDK5v0GJnIY_yGbiCOEL_Haqql2ALOkTxlvEK6iT3FtAIh8VlNoQaBV1DLEL8CvT7g1Y29LWrQh8P_3vARHutVvrdkSfMiKgbkOGozlvCtOF4WKNdNk8-83mr3h2dkxmNIRmvsoqoBtg4943QfFXbOH6K_sehrYciyApSXMw9K8nKDY1X9Jc7mnsgaro29cYYjMZ4fyOg_XuvNN0LH5ln5g',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;

  @ApiModelProperty({
    example: Platform.WEB,
    in: `${Platform.IOS}, ${Platform.WEB}, ${Platform.ANDROID}`,
    description: 'Must be one of the following: ios, web, android.',
  })
  @IsString()
  @IsIn([Platform.IOS, Platform.ANDROID, Platform.WEB])
  platform: string;

  constructor(data: GoogleLoginInterface) {
    if (data) {
      this.platform = data.platform;
      this.idToken = data.idToken;
    }
  }
}

export interface GoogleLoginInterface {
  idToken: string;
  platform: string;
}

export interface RegisterInterface extends CredentialsInterface {
  fullName: string;
  avatar?: string;
  isVerified?: boolean;
}
