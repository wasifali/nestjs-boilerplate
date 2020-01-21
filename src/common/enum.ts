export const enum StrategyNames {
  GOOGLE_STRATEGY = 'google',
  REGISTER_STRATEGY = 'register',
}

export enum IDP {
  GOOGLE = 'google',
}

export const enum Platform {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
}

export const enum ErrorMessage {
  GENERIC_FORBIDDEN = 'You do not have necessary permissions to execute this request!',
  GENERIC_NOT_FOUND = 'Resource not found!',
  INVALID_JWT = 'Invalid jwt token!',
  ACCOUNT_EXISTS = 'Account with given email already exists!',
  REGISTER_FIRST = 'Please signup first to activate your account!',
  ALREADY_VERIFIED = 'Already Verified!',
  UNVERIFIED_USER = 'Unverified Email!',
  UNAUTHORIZED = 'Please Login First!',
}

export const enum ResponseMessage {
  FORGOT_PASSWORD = 'An email has been sent with reset password instructions! Please check your email!',
  REGISTER_SUCCESS = 'We have sent you an activation email! Please check your email to activate your account!',
}
