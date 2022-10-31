import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Another way is to call setup(app). However, we don't use that way, thought.
  // setup(app); // import {setup} from './setup-app'

  // Instead: we will setup in app.module.ts -> for integration testing
  // app.use(cookieSession({ keys: ['asdfasfd'] }));
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();
