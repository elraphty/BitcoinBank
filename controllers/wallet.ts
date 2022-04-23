import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import knex from '../db';
import { validationResult } from 'express-validator';
import { responseSuccess, responseErrorValidation, responseError } from '../helpers';
import { TransactionLogs, UserBalance } from '../interfaces/db';
import { RequestUser } from '../interfaces';
import bitrpc from '../bitqueries';
import axios from 'axios';
import { TransactionResult } from '../interfaces/transactions';
import { hotwalletname } from '../config';

dotenv.config();

const baseFee = process.env.BASE_FEE ? Number(process.env.BASE_FEE) : 0.00000200;
const feePercent = process.env.FEE_PERCENT ? Number(process.env.FEE_PERCENT) : 1;

// Create a transaction with one percent transaction fee
export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    const reqUser = req as RequestUser;
    const userId = reqUser.user.id;

    const amount: number = Number(req.body.amount);
    const recipient: string = req.body.recipient;
    const transactionFee: number = Math.floor(amount * feePercent / 100);

    // Get fee from memspace signet api
    const feesReq = await axios.get('https://mempool.space/signet/api/v1/fees/recommended');
    const feerate = feesReq.data.fastestFee;

    // Get user balance
    const userBalance = await knex<UserBalance>('usersbalance').where({ userid: userId }).first();

    // Get last transaction in transaction logs
    const lastTransaction = await knex<TransactionLogs>('transactionlogs').orderBy('id', 'desc').limit(1);

    // Get the fee for the last transaction
    const getLastTransaction: TransactionResult = await (await bitrpc.getTransaction(lastTransaction[0].txid, hotwalletname)).data?.result;

    // If last transaction fee, set the lastfee to last transaction fee else base fee
    const lastFee: number = getLastTransaction?.fee ? getLastTransaction.fee : baseFee;

    const total = Number(userBalance?.amount) + lastFee;

    /*** If the users balance is not greater than the amount plus fee estimates don't send */
    if (amount > total) {
        return responseError(res, 403, 'Top up your balance');
    }

    bitrpc.createTransaction(hotwalletname, recipient, amount, feerate)
        .then(async (tranRes) => {
            const txid: string = tranRes.data.result;
            // Update the User's Balance with the transaction amount

            const transReq = await bitrpc.getTransaction(txid, hotwalletname);
            const transaction: TransactionResult = transReq.data.result;

            const amtToDeduct = amount + transactionFee + Number(transaction.fee);

            await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount - ${amtToDeduct}`) }).where({ userid: userId });

            // insert in the transaction logs
            await knex<TransactionLogs>('transactionlogs').insert({
                amount: amount,
                txid: txid,
                status: 1,
                type: 'send',
                userid: userId
            });

            responseSuccess(res, 200, 'Successfully sent transaction', { txid });
        })
        .catch((e) => {
            return responseError(res, 403, 'Could not send transaction');
        });
}

// Create a transaction with one percent transaction fee
export const listTransactions = async (req: Request, res: Response, next: NextFunction) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return responseErrorValidation(res, 400, errors.array());
    }

    const reqUser = req as RequestUser;
    const userId = reqUser.user.id;

    // list user transactions
    const transactions = await knex<TransactionLogs>('transactionlogs').where({ userid: userId });

    responseSuccess(res, 200, 'Successfully listed transaction', { transactions });
}
