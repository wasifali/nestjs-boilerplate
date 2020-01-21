import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Conflict, UnprocessableEntityResponse } from '../../../common/responses';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessage } from '../../../common/enum';

export class LogoutSuccessResponse {
  @ApiModelProperty({ example: true })
  ok: string;
}

export class AuthSuccess {
  @ApiModelProperty({ example: '5dc33157e407e275e07c3139' })
  // tslint:disable-next-line:variable-name
  _id: string;

  @ApiModelPropertyOptional({ example: 'avatar_1572695366655_cx1e_Talha%2BMasood.png' })
  avatar: string;

  @ApiModelProperty({ example: 'true' })
  isActive: boolean;

  @ApiModelProperty({ example: 'true' })
  isVerified: boolean;

  @ApiModelProperty({ example: 'demo@serendipia.dev' })
  email: string;

  @ApiModelProperty({ example: '2019-11-06T20:47:19.141Z' })
  createdAt: Date;

  @ApiModelProperty({ example: '2019-11-06T20:47:19.141Z' })
  updatedAt: Date;
}

export class GoogleLoginUnprocessableEntityResponseWithMessage extends UnprocessableEntityResponse {
  @ApiModelProperty({ example: 'Unable to verify idToken against given platform!' })
  message: string;
}

export class ResetPasswordSuccessResponse {
  @ApiModelProperty({ example: HttpStatus.CREATED })
  statusCode: number;

  @ApiModelProperty({ example: 'Password Updated Successfully!' })
  message: string;
}

export class RegisterSuccessResponse {
  @ApiModelProperty({
    example:
      'We have sent you an activation email! Please check your email to activate your account!',
  })
  message: string;
}

export class JwtInvalidResponse extends UnprocessableEntityResponse {
  @ApiModelProperty({
    example: ErrorMessage.INVALID_JWT,
  })
  message: string;
}

export class ActivationConflictResponse extends Conflict {
  @ApiModelProperty({
    example: ErrorMessage.ALREADY_VERIFIED,
  })
  message: string;
}
