import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { User } from '../interfaces/db';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { hashPassword, verifyPassword } from '../helpers/password';

// Controller for registering user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const username: string = req.body.user;
        const pass: string = req.body.password;

        const user: User[] = await knex<User>('users').where({ username });

        if (user.length > 0) {
            return responseError(res, 404, 'User already exists');
        }

        const password: string = hashPassword(pass);

        await knex<User>('users').insert({ username, password });

        responseSuccess(res, 200, 'Successfully created user', {});
    } catch (err) {
        next(err);
    }
};