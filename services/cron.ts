import bitrpc from '../bitqueries';
import { TransactionResult } from '../interfaces/transactions';
import knex from '../db';
import { TransactionLogs, UserAddress, UserBalance } from '../interfaces/db';

export const getReceived = () => {
    return setInterval(async () => {
        const transactions: TransactionResult[] = await (await bitrpc.getTransactions('hotwallet')).data.result;

        transactions.forEach(async trans => {
            // Set the user address
            const userAddress: string = trans.address;

            // If the transaction is a receive category
            if (trans.category === 'receive') {
                // Check if the transaction has been added to the database log, if not add it
                const alltrans: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ txid: trans.txid });

                if (alltrans.length === 0) {
                    await knex<TransactionLogs>('transactionlogs').insert({
                        amount: trans.amount,
                        txid: trans.txid,
                        status: 0,
                        type: trans.category
                    });
                }
            }

            // If the transaction has 2 confirmations
            if (trans.confirmations === 2) {
                // Get the user with the address, if the uset is existent update their balance 
                const user: UserAddress[] = await knex<UserAddress>('useraddresses').where({ receiveaddress: userAddress });

                if (user.length === 1) {
                    const userId: number | undefined = user[0].userid;

                    // Update the User's Balance with the transaction amount
                    await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount + ${trans.amount}`) }).where({ userid: userId });

                    // Update the transaction status in transaction log
                    await knex<TransactionLogs>('transactionlogs').update({ status: 1 }).where({ txid: trans.txid });
                }
            } else if (trans.confirmations > 2) {
                // If the confirmation is greater than 2 and it is not existent in our users transaction logs
                // Add to the users balance
                const alltrans: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ txid: trans.txid });

                if (alltrans.length === 1 && Number(alltrans[0].status) === 0) {
                    // Get the user with the address, if the uset is existent update their balance 
                    const user: UserAddress[] = await knex<UserAddress>('useraddresses').where({ receiveaddress: userAddress });

                    if (user.length === 1) {
                        const userId: number | undefined = user[0].userid;

                        // Update the User's Balance with the transaction amount
                        await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount + ${trans.amount}`) }).where({ userid: userId });

                        // Update the transaction status in transaction log
                        await knex<TransactionLogs>('transactionlogs').update({ status: 1 }).where({ txid: trans.txid });
                    }
                }
            }
        });
    }, 1000 * 60 * 10);
}