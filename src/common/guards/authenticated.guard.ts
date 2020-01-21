import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { HttpErrors } from '../errors';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = await request.isAuthenticated();
    if (!result) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: HttpErrors.UNAUTHORIZED,
        message: 'Session Expired! Please login again!',
      });
    }
    return result;
  }
}
