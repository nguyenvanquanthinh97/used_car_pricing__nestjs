import { INestApplication, ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

export const setup = (app: INestApplication) => {
  app.use(cookieSession({ keys: ['asdfasfd'] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
};
