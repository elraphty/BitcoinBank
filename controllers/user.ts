import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { User, UserAddress, UserBalance } from '../interfaces/db';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { hashPassword } from '../helpers/password';
import bitqueries from '../bitqueries';
import { addressType } from '../interfaces/addresses';

// Controller for registering user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseErrorValidation(res, 400, errors.array());
        }

        const username: string = req.body.username;
        const pass: string = req.body.password;

        // Check if username already exists in the database, throw an error if it does
        const user: User[] = await knex<User>('users').where({ username });

        if (user.length > 0) {
            return responseError(res, 400, 'User already exists');
        }

        const password: string = hashPassword(pass);

        const userId = await knex<User>('users').insert({ username, password }).returning('id');

        const { data } = await bitqueries.getNewAddress('useraddress', addressType.bech32, 'hotwallet');
        const address = data.result;

        if (userId.length > 0) {
            // Create user address
            const id = userId[0].id;
            await knex<UserAddress>('useraddresses').insert({ userid: id, receiveaddress: address });
            await knex<UserBalance>('usersbalance').insert({ userid: id, amount: 0 });
        }

        responseSuccess(res, 200, 'Successfully created user', {});
    } catch (err) {
        next(err);
    }
};