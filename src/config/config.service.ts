import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { ConfigInterface } from './intefaces/config.interface';

export class ConfigService {
  private readonly envConfig: ConfigInterface;

  constructor() {
    dotenv.config();
    const config: { [name: string]: string } = process.env;
    const parsedConfig = JSON.parse(JSON.stringify(config));
    this.envConfig = this.validateInput(parsedConfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput = (envConfig): ConfigInterface => {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .required()
        .valid('development', 'production', 'test', 'provision', 'inspection')
        .default('development'),
      SERVER_PORT: Joi.number().required(),
      MONGO_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      REDIS_URI: Joi.string().required(),
      GOOGLE_WEB_CLIENT_ID: Joi.string().required(),
      GOOGLE_IOS_CLIENT_ID: Joi.string().required(),
      GOOGLE_ANDROID_CLIENT_ID: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  };

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get serverPort(): number {
    return this.envConfig.SERVER_PORT;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get mongoUri(): string {
    return this.envConfig.MONGO_URI;
  }

  get redisUri(): string {
    return this.envConfig.REDIS_URI;
  }

  get googleWebClientId(): string {
    return this.envConfig.GOOGLE_WEB_CLIENT_ID;
  }

  get googleIosClientId(): string {
    return this.envConfig.GOOGLE_IOS_CLIENT_ID;
  }

  get googleAndroidClientId(): string {
    return this.envConfig.GOOGLE_ANDROID_CLIENT_ID;
  }
}
