/* eslint-disable */
import { HttpService, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StringHelper } from '../helpers/string.helper';
import { ConfigService } from '../config/config.service';
import { RedisService } from 'nestjs-redis';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { TestingModule, Test } from '@nestjs/testing';
import { AuthHelper } from '../helpers/auth.helper';
import { OAuth2Client } from 'google-auth-library';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: StringHelper,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: RedisService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: OAuth2Client,
          useValue: {},
        },
        {
          provide: AuthHelper,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
