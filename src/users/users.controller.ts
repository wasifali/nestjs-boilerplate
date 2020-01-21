import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { AuthSuccess } from '../auth/types/responses/login.response';
import { GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { HttpErrors } from '../common/errors';
import { MeInterface } from './types/interfaces/user.interface';
import { EmailDto } from './types/dto/user.dto';
import { RequestWithUser } from '../common/interfaces';

@ApiUseTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  @ApiOkResponse({ description: 'OK', type: AuthSuccess })
  @ApiUnauthorizedResponse({
    description: 'Session Expired or Not Logged In!',
    type: GenericUnauthorizedResponse,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async getMyInfo(@Req() req: RequestWithUser): Promise<MeInterface> {
    return this.usersService.getMe(req.user._id);
  }
}
