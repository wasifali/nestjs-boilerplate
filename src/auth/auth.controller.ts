import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './types/dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import {
  AuthFailedWithInvalidCreds,
  BadRequestForResetPassword,
  Conflict,
  CreatedWithMessageForForgotPassword,
  GenericUnauthorizedResponse,
  InternalServerErrorWithMessage,
  NotFoundWithMessage,
  ValidationBadRequest,
} from '../common/responses';
import { HttpErrors } from '../common/errors';
import { LoginGuard } from '../common/guards/login.guard';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { RegisterGuard } from '../common/guards/register.guard';
import {
  LogoutSuccessResponse,
  AuthSuccess,
  GoogleLoginUnprocessableEntityResponseWithMessage,
  ResetPasswordSuccessResponse,
  RegisterSuccessResponse,
  JwtInvalidResponse,
  ActivationConflictResponse,
} from './types/responses/login.response';
import { LogoutInterface, RegisterSuccessInterface } from './types/interfaces/login.interface';
import { GoogleGuard } from '../common/guards/google.guard';
import { RequestWithUser } from '../common/interfaces';
import { UserInterface } from '../schemas/user.schema';
import { Request } from 'express';
import { ErrorMessage } from '../common/enum';
import { JwtDto } from '../common/dto';
import { EmailDto } from '../users/types/dto/user.dto';

@ApiUseTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // local authentication
  @UseGuards(LoginGuard)
  // method for endpoint!
  @Post('login')
  // decorators for API documentation!
  @ApiCreatedResponse({ description: 'Successfully Authenticated!', type: AuthSuccess })
  @ApiUnauthorizedResponse({
    description: 'Authentication Failed!',
    type: AuthFailedWithInvalidCreds,
  })
  @ApiBadRequestResponse({
    description: 'Missing Parameters or Validation Failed!',
    type: ValidationBadRequest,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  // controller function to handle login endpoint request!
  async login(@Req() req: RequestWithUser, @Body() credentials: LoginDto): Promise<UserInterface> {
    const user = req.user;
    delete user.password;
    return user;
  }

  // post endpoint for registering user!
  // method for endpoint!
  @Post('register')
  @ApiConflictResponse({ description: 'Account with given email already exists!', type: Conflict })
  @ApiCreatedResponse({ description: 'Registration Successful!', type: RegisterSuccessResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @ApiBadRequestResponse({
    description: 'Missing Parameters or Validation Failed!',
    type: ValidationBadRequest,
  })
  // controller function to handle register endpoint request!
  async register(
    @Req() req: Request,
    @Body() body: RegisterDto,
  ): Promise<RegisterSuccessInterface> {
    const user: UserInterface = await this.authService.register(body, false);
    return await this.authService.sendActivationEmail(user);
  }

  @Get('register/verify/link')
  @ApiConflictResponse({ description: 'Already Activated!', type: Conflict })
  @ApiOkResponse({ description: 'OK!', type: RegisterSuccessResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @ApiBadRequestResponse({
    description: 'Missing Parameters or Validation Failed!',
    type: ValidationBadRequest,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async sendActivationLinkAgain(@Query() query: EmailDto): Promise<RegisterSuccessInterface> {
    return await this.authService.findAndSendActivationEmail(query.email);
  }

  @UseGuards(RegisterGuard)
  @Post('register/verify')
  @ApiCreatedResponse({ description: 'Activation Successful', type: AuthSuccess })
  @ApiBadRequestResponse({
    description: 'Missing Parameters or Validation Failed!',
    type: ValidationBadRequest,
  })
  @ApiConflictResponse({
    description: ErrorMessage.ALREADY_VERIFIED,
    type: ActivationConflictResponse,
  })
  @ApiUnprocessableEntityResponse({ description: 'Invalid Jwt', type: JwtInvalidResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async registerByActivationLink(
    @Body() body: JwtDto,
    @Req() req: RequestWithUser,
  ): Promise<UserInterface> {
    const user: UserInterface = req.user;
    delete user.password;
    return user;
  }

  // post endpoint for login or register with google
  @UseGuards(GoogleGuard)
  @Post('google')
  @ApiCreatedResponse({ description: 'Successfully Authenticated!', type: AuthSuccess })
  @ApiUnprocessableEntityResponse({
    description: 'Token Invalid or Expired!',
    type: GoogleLoginUnprocessableEntityResponseWithMessage,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async googleLogin(
    @Req() req: RequestWithUser,
    @Body() body: GoogleLoginDto,
  ): Promise<UserInterface> {
    const user = req.user;
    delete user.password;
    return user;
  }

  // post endpoint for forgot-password!
  @Post('forgot-password')
  // decorators for API documentation!
  @ApiNotFoundResponse({
    description: 'User with given email not found!',
    type: NotFoundWithMessage,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @ApiBadRequestResponse({
    description: 'Missing Parameters or Validation Failed!',
    type: ValidationBadRequest,
  })
  @ApiCreatedResponse({ description: 'OK', type: CreatedWithMessageForForgotPassword })
  // controller function to handle forgot-password endpoint request!
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<{ message: string }> {
    return await this.authService.forgotPassword(body);
  }

  // post endpoint for reset-password!
  @Post('reset-password')
  // decorators for API documentation!
  @ApiCreatedResponse({
    description: 'Password Updated Successfully!',
    type: ResetPasswordSuccessResponse,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Code or Expired Code!',
    type: BadRequestForResetPassword,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  // controller function to handle reset-password endpoint request!
  async resetPassword(@Body() body: ResetPasswordDto): Promise<string> {
    this.authService.passwordMatch(body);
    return await this.authService.resetPassword(body);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @ApiOkResponse({ description: 'Logout Successfully!', type: LogoutSuccessResponse })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized Request!',
    type: GenericUnauthorizedResponse,
  })
  async get(@Req() req): Promise<LogoutInterface> {
    await req.logOut();
    return {
      ok: true,
    };
  }
}
