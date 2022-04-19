import { Request, Response, NextFunction } from 'express';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { UserBalance } from '../interfaces/db';
import { RequestUser } from '../interfaces';
import bitrpc from '../bitqueries';
import axios from 'axios';
import { TransactionResult } from '../interfaces/transactions';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    const amount: number = Number(req.body.amount);
    const recipient: string = req.body.recipient;


    const reqUser = req as RequestUser;

    const feesReq = await axios.get('https://mempool.space/signet/api/v1/fees/recommended');
    const feerate = feesReq.data.fastestFee;
    const userId = reqUser.user.id;

    // Get user balance
    const userBalance = await knex<UserBalance>('usersbalance').where({ userid: userId }).first();

    const total = feerate + Number(userBalance?.amount);

    /*** If the users balance is not greater than the amount plus fee estimates don't send */
    if (amount > total) {
        return responseError(res, 403, 'Top up your balance');
    }

    bitrpc.createTransaction('hotwallet', recipient, amount, feerate)
        .then(async (tranRes) => {
            const txid: string = tranRes.data.result;
            // Update the User's Balance with the transaction amount

            const transReq = await bitrpc.getTransaction(txid, 'hotwallet');
            const transaction: TransactionResult = transReq.data.result;

            const amtToDeduct = amount + Number(transaction.fee);

            await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount - ${amtToDeduct}`) }).where({ userid: userId });

            responseSuccess(res, 200, 'Successfully sent transaction', { txid });
        })
        .catch((e) => {
            return responseError(res, 403, 'Could not send transaction');
        });
}