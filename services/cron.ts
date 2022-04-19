import bitrpc from '../bitqueries';
import { TransactionResult } from '../interfaces/transactions';
import knex from '../db';
import { UserAddress, UserBalance } from '../interfaces/db';

export const getReceived = () => {
    return setInterval(async () => {
        const wallets = await (await bitrpc.listWallets()).data.result;

        const transactions: TransactionResult[] = await (await bitrpc.getTransactions(wallets[0])).data.result;

        transactions.forEach(async trans => {
            // If the transaction has 2 confirmations
            console.log('Transactions', trans);
            if (trans.confirmations === 2) {
                console.log('Two confirmations', trans);
                const userAddress: string = trans.address;

                // Get the user with the address, if the uset is existent update their balance 
                const user: UserAddress[] = await knex<UserAddress>('useraddresses').where({ receiveaddress: userAddress });

                if (user.length === 1) {
                    const userId: number | undefined = user[0].userid;

                    // Update the User's Balance with the transaction amount
                    await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount + ${trans.amount}`) }).where({ userid: userId });
                }
            } else if(trans.confirmations > 2) {
                // If the confirmation is greater than 2 and it is not existent in our users transaction logs
                // Add to the users balance
                // Not implemented
            }
        });
    }, 1000 * 60 * 10);
}