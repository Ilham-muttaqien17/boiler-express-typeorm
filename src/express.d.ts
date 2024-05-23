import { User } from './db/entities/user.entity';

declare global {
  namespace Express {
    interface Locals {
      [k in string]: any;
      session: User;
    }
  }
}
