import { Request } from 'express';

declare module 'express' {
  interface Request {
    currentUser?: user;
  }
}
