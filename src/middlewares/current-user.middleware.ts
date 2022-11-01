import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

// There are 2 ways to do this. Option1 is below, and option2 is declare in src/global/global.d.ts
// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }
    next();
  }
}
