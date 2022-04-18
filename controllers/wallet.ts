import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import bitqueries from '../bitqueries';
import { User } from '../interfaces/db';
import { RequestUser } from '../interfaces';

export const createTransaction = (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    const reqUser = req as RequestUser;

    console.log('REQ ===', reqUser.user);
}