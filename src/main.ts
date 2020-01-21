import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { ConfigService } from './config/config.service';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import * as session from 'express-session';
import * as flash from 'connect-flash';
import { NestExpressApplication } from '@nestjs/platform-express';
import { nodeEnv, sessionName } from './common/constants';
/* eslint-disable */
const MongoDBStore = require('connect-mongodb-session')(session);
/* eslint-enable */

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API')
    .setVersion('1.0')
    .addTag('Auth', 'Auth API Endpoints!')
    .addTag('User', 'User API Endpoints!')
    .setBasePath('api')
    .setSchemes(config.nodeEnv === nodeEnv.DEVELOPMENT ? 'http' : 'https')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  if (config.nodeEnv !== nodeEnv.PRODUCTION) {
    SwaggerModule.setup('api/docs', app, document);
  }
  app.use(compression());
  app.use(helmet());
  if (config.nodeEnv !== nodeEnv.PRODUCTION) {
    app.enableCors({
      origin: ['http://localhost:3000'],
      credentials: true,
    });
  }
  app.use(morgan('dev'));
  // tslint:disable-next-line:no-magic-numbers
  const store = new MongoDBStore({
    uri: config.mongoUri, // This will come from the env file
    collection: 'sessions',
  });
  // use sessions
  const sessionOptions = {
    name: sessionName,
    secret: config.jwtSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      originalMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days session
      secure: 'auto',
    },
    store,
    trustProxy: false,
  };

  if (config.nodeEnv === nodeEnv.PRODUCTION) {
    sessionOptions.trustProxy = true;
    app.enable('trust proxy');
  }

  app.use(session(sessionOptions));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(config.serverPort);
  console.log('The app is up on port:', config.serverPort);
  return app;
}
bootstrap();
