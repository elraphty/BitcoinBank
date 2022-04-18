import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { UserBalance } from '../interfaces/db';
import { RequestUser } from '../interfaces';
import bitrpc from '../bitqueries';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    const amount: number = Number(req.body.amount);
    const recipient: string = req.body.recipient;

    /*** If the users balance is not greater than the amount plus fee estimates don't send */
    const reqUser = req as RequestUser;
    const feeReq = await bitrpc.getFeeEstimate(2);
    const feerate = feeReq.data.result?.feerate;
    const userId = reqUser.user.id;
    // Get user balance
    const userBalance = await knex<UserBalance>('usersbalance').where({ userid: userId }).first();

    const total = feerate + Number(userBalance?.amount);

    if (amount > total) {
        return responseError(res, 403, 'Top up your balance');
    }

    const amtToDeduct = amount + feerate;

    bitrpc.createTransaction('hotwallet', recipient, amount)
        .then(async (tranRes) => {
            const txid: string = tranRes.data.result;
            // Update the User's Balance with the transaction amount
            await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount - ${amtToDeduct}`) }).where({ userid: userId });

            responseSuccess(res, 200, 'Successfully sent transaction', { txid });
        })
        .catch((e) => {
            return responseError(res, 403, 'Could not send transaction');
        });
}