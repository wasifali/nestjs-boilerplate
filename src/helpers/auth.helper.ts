import { UserInterface } from '../schemas/user.schema';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpErrors } from '../common/errors';
import { ErrorMessage } from '../common/enum';
@Injectable()
export class AuthHelper {
  async checkUserActivationStatus(user: UserInterface): Promise<boolean> {
    if (!user || !user.isActive || user.isShadow) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessage.REGISTER_FIRST,
      });
    }
    if (user.isVerified) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessage.ALREADY_VERIFIED,
      });
    }
    return true;
  }
}
