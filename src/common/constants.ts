import { SignOptions } from 'jsonwebtoken';

export const defaultJWTSignOptions: SignOptions = {
  issuer: 'issuer',
  algorithm: 'HS256',
};

export const enum nodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
  INSPECTION = 'inspection',
}

export const sessionName = 'session';

export const systemName = 'nest-boilerplate';
