import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import bitqueries from '../bitqueries';

export const createTransaction  = (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    console.log('User ==== ', req.session.user);
}