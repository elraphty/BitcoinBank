import { NextFunction, Request, Response } from 'express';
import { verifyUser } from './jwt';
import { responseError } from '.';
import { User } from '../interfaces/db';

export const authUser = (req: Request, res: Response, next: NextFunction) => {
  // check if there is an authorization header
  if (!req.headers.authorization) return responseError(res, 503, 'Unauthorized');
  else {

    const token = req.headers.authorization.substring(7);
  
    verifyUser(token, (err: string, ans: User) => {
      if (err) {
        return responseError(res, 503, 'Not an authorized user');
      }

      // set user to session
      // console.log('Ans ===', ans);
      req.session.user = ans;
    });
  }

  return next();
};