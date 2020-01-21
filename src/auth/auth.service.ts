import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, RegisterInterface } from './types/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserInterface } from '../schemas/user.schema';
import {
  ActivationJwtInterface,
  ForgotPasswordInterface,
  RegisterSuccessInterface,
  ResetPasswordInterface,
} from './types/interfaces/login.interface';
import { StringHelper } from '../helpers/string.helper';
import { ConfigService } from '../config/config.service';
import { HttpErrors } from '../common/errors';
import { RedisService } from 'nestjs-redis';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { OAuth2Client } from 'google-auth-library';
import { ErrorMessage, IDP, Platform, ResponseMessage } from '../common/enum';
import { cloneDeep } from 'lodash';
import { AuthHelper } from '../helpers/auth.helper';
import { MeInterface } from '../users/types/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly stringHelper: StringHelper,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly googleClient: OAuth2Client,
    private readonly authHelper: AuthHelper,
  ) {}

  // validate username and password of a user!
  async validateUser(credentials: LoginDto): Promise<UserInterface> {
    const user: UserInterface = await this.usersService.findOne(
      { email: credentials.email },
      {
        idps: 0,
        isShadow: 0,
        __v: 0,
      },
    );
    if (
      user &&
      user.password &&
      user.isActive &&
      bcrypt.compareSync(credentials.password, user.password)
    ) {
      delete user.password;
      if (!user.isVerified) {
        throw new HttpException(
          {
            statusCode: HttpStatus.PRECONDITION_FAILED,
            error: HttpErrors.PRECONDITION_FAILED,
            message: ErrorMessage.UNVERIFIED_USER,
          },
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      return user;
    }
    return undefined;
  }

  async getUser(userId: string): Promise<MeInterface> {
    return await this.usersService.getMe(userId);
  }

  async register(user: RegisterDto, registerByInvitation: boolean): Promise<UserInterface> {
    const newUser: RegisterInterface = cloneDeep(user);
    // hashing password using bcrypt library!
    newUser.password = await bcrypt.hashSync(user.password, 10);
    // triming spaces before adding user to database
    newUser.fullName = user.fullName.trim();
    // email to lowerCase before adding to db!
    newUser.email = user.email.toLowerCase();
    newUser.isVerified = registerByInvitation;
    const existingUser: UserInterface = await this.usersService.findOne({
      email: newUser.email,
    });
    if (existingUser) {
      if (existingUser.isActive && !existingUser.isShadow) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          error: HttpErrors.CONFLICT,
          message: ErrorMessage.ACCOUNT_EXISTS,
        });
      }
      const updatedUserValues: UserInterface = {
        isShadow: false,
        isActive: true,
        password: newUser.password,
        fullName: newUser.fullName,
        avatar: newUser.avatar,
        isVerified: newUser.isVerified,
      };
      const updatedUser = (await this.usersService.findOneAndUpdateOne(
        updatedUserValues,
        {
          email: newUser.email,
        },
        {
          new: true,
          lean: true,
        },
      )) as UserInterface;
      if (updatedUser) {
        return updatedUser;
      }
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    } else {
      return await this.usersService.insertOne(newUser);
    }
  }

  async registerByActivationLink(jwt: string): Promise<UserInterface> {
    let userToBeActivate: ActivationJwtInterface;
    try {
      userToBeActivate = ((await this.stringHelper.verifyPayload(
        jwt,
      )) as unknown) as ActivationJwtInterface;
    } catch (e) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessage.INVALID_JWT,
      });
    }
    const user: UserInterface = await this.usersService.findOne({
      email: userToBeActivate.email,
    });
    await this.authHelper.checkUserActivationStatus(user);
    return ((await this.usersService.findOneAndUpdateOne(
      {
        isVerified: true,
      },
      {
        email: userToBeActivate.email,
      },
      {
        new: true,
        lean: true,
      },
    )) as unknown) as UserInterface;
  }

  async findAndSendActivationEmail(email: string): Promise<RegisterSuccessInterface> {
    const user: UserInterface = await this.usersService.findOne({
      email,
    });
    await this.authHelper.checkUserActivationStatus(user);
    return await this.sendActivationEmail(user);
  }

  async sendActivationEmail(user: UserInterface): Promise<RegisterSuccessInterface> {
    const activationObject: ActivationJwtInterface = {
      email: user.email,
    };
    const jwt = await this.stringHelper.signPayload(activationObject, 'activation');
    // this.mailgunHelper.confirmEmail(jwt, user.email, user.fullName);
    return {
      message: ResponseMessage.REGISTER_SUCCESS,
    };
  }

  async forgotPassword(user: ForgotPasswordInterface): Promise<{ message: string }> {
    const foundUser = await this.usersService.findOne({ email: user.email });
    if (foundUser) {
      const redisClient = await this.redisService.getClient();
      const code = await this.stringHelper.generateRandomNumber(6);
      try {
        const resp = await redisClient.set(foundUser.email, code, 'EX', 3600);
        if (resp === 'OK') {
          // this.mailgunHelper.forgotPasswordEmail(foundUser.email, foundUser.fullName, code);
          return {
            message: ResponseMessage.FORGOT_PASSWORD,
          };
        } else {
          throw new InternalServerErrorException(defaultInternalServerErrorResponse);
        }
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    } else {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: 'User not found!',
      });
    }
  }

  // tslint:disable-next-line:no-any
  async resetPassword(resetInfo: ResetPasswordInterface): Promise<any> {
    const redisClient = await this.redisService.getClient();
    try {
      const value = await redisClient.get(resetInfo.email);
      if (value) {
        if (resetInfo.code === value) {
          const password = bcrypt.hashSync(resetInfo.password, 10);
          const update = await this.usersService.update(
            { password, isVerified: true },
            { email: resetInfo.email },
          );
          if (update.ok && update.n) {
            await this.usersService.findOne({ email: resetInfo.email });
            try {
              await redisClient.del(resetInfo.email);
            } catch (e) {
              console.log(e);
            }
            return {
              statusCode: HttpStatus.CREATED,
              message: 'Password Updated Successfully!',
            };
          } else {
            throw new InternalServerErrorException(defaultInternalServerErrorResponse);
          }
        } else {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: HttpErrors.BAD_REQUEST,
            message: 'Invalid Code!',
          });
        }
      } else {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: HttpErrors.BAD_REQUEST,
          message:
            'Given passcode is expired! Please try forgot password again to generate new passcode!',
        });
      }
    } catch (e) {
      if (e.status) {
        throw e;
      } else {
        throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    }
  }

  async googleLogin(idToken: string, platform: string): Promise<UserInterface> {
    let audience;
    switch (platform) {
      case Platform.WEB:
        audience = this.configService.googleWebClientId;
        break;
      case Platform.IOS:
        audience = this.configService.googleIosClientId;
        break;
      case Platform.ANDROID:
        audience = this.configService.googleAndroidClientId;
        break;
      default:
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: HttpErrors.BAD_REQUEST,
          message: 'Platform is required and it must be one of following: ios,android,web.',
        });
    }
    try {
      const response = await this.googleClient.verifyIdToken({
        idToken,
        audience,
      });
      const userData = response.getPayload();
      const userId = response.getUserId();
      const email = userData.email;
      const fullName = userData.name;
      let user: UserInterface = await this.usersService.findOne({
        idps: {
          $elemMatch: {
            provider: IDP.GOOGLE,
            userId,
          },
        },
      });
      if (user) {
        return user;
      } else {
        user = (await this.usersService.findOneAndUpdateOne(
          {
            $push: {
              idps: {
                provider: IDP.GOOGLE,
                userId,
              },
            },
            isActive: true,
            isVerified: true,
            isShadow: false,
          },
          {
            email,
          },
          {
            new: true,
            lean: true,
          },
        )) as UserInterface;
        if (user) {
          return user;
        } else {
          user = {
            email,
            fullName,
            // tslint:disable-next-line:no-null-keyword
            password: null,
            isVerified: true,
            idps: [
              {
                provider: IDP.GOOGLE,
                userId,
              },
            ],
          };
          return await this.usersService.insertOne(user);
        }
      }
    } catch (e) {
      console.log(e);
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: 'Unable to verify idToken against given platform!',
      });
    }
  }

  passwordMatch(target): boolean {
    // if password do not matches confirmPassword, throw an error of bad request!!
    if (target.password !== target.confirmPassword) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          {
            target,
            value: target.confirmPassword,
            property: 'confirmPassword',
            children: [],
            constraints: {
              passwordMatch: 'confirmPassword must be equal to password!',
            },
          },
        ],
      });
    }
    return true;
  }
}
