export interface ForgotPasswordInterface {
  email: string;
}

export interface PasswordInterface {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordInterface extends PasswordInterface, ForgotPasswordInterface {
  code: string;
}

export interface LogoutInterface {
  ok: boolean;
}

export interface ActivationJwtInterface {
  email: string;
}

export interface RegisterSuccessInterface {
  message: string;
}
