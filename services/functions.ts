import bitrpc from '../bitqueries';
import { TransactionResult } from '../interfaces/transactions';
import knex from '../db';
import { TransactionLogs, UserAddress, UserBalance } from '../interfaces/db';
import { addressType } from '../interfaces/addresses';

// Generate a new address
const getNewAddress = async (userId: number | undefined) => {
    const { data } = await bitrpc.getNewAddress('useraddress', addressType.bech32, 'hotwallet');
    const address = data.result;

    // Update user address
    await knex<UserAddress>('useraddresse').update({ receiveaddress: address }).where({ userid: userId });
    // Add address to address log
    await knex<UserAddress>('addresslogs').insert({ userid: userId, receiveaddress: address });
}

// Update Balance and Transaction logs
const updateBAndT = async (userId: number | undefined, txid: string, amount: number) => {
    // Update the User's Balance with the transaction amount
    await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount + ${amount}`) }).where({ userid: userId });

    // Update the transaction status in transaction log
    await knex<TransactionLogs>('transactionlogs').update({ status: 1 }).where({ txid: txid });
}

export const getReceived = async () => {
    const transactions: TransactionResult[] = await (await bitrpc.getTransactions('hotwallet')).data.result;

    transactions.forEach(async trans => {
        console.log('Transactions ===', trans);

        // Set the user address
        const userAddress: string = trans.address;

        // Get the user with the address, if the uset is existent update their balance 
        const user: UserAddress[] = await knex<UserAddress>('addresslogs').where({ receiveaddress: userAddress });

        if (user.length === 1) {
            const userId: number | undefined = user[0].userid;

            // If the transaction is a receive category
            if (trans.category === 'receive') {
                // Check if the transaction has been added to the database log, if not add it
                const alltrans: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ txid: trans.txid });

                if (alltrans.length === 0) {
                    await knex<TransactionLogs>('transactionlogs').insert({
                        amount: trans.amount,
                        txid: trans.txid,
                        status: 0,
                        type: trans.category,
                        userid: userId
                    });
                }
            }

            // If the transaction has 2 confirmations
            if (trans.confirmations === 2) {
                // Update transaction logs and balance
                await updateBAndT(userId, trans.txid, trans.amount);

                // Generate new address for the user
                await getNewAddress(userId);
            } else if (trans.confirmations > 2) {
                // If the confirmation is greater than 2 and it is not existent in our users transaction logs
                // Add to the users balance
                const alltrans: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ txid: trans.txid });

                if (alltrans.length === 1 && Number(alltrans[0].status) === 0) {
                    // Update transaction logs and balance
                    await updateBAndT(userId, trans.txid, trans.amount);

                    // Generate new address for the user
                    await getNewAddress(userId);
                }
            }
        }
    });
}

/** The hotwallet should have 20% of the total funds while 
 * the rest of the 80% should be in the cold wallet */
export const checkWalletBalances = async () => {
    const coldWallet = 80;
    const hotWallet = 20;

    const hotBalReq = await bitrpc.getWalletBalance('hotwallet');
    const coldBalReq = await bitrpc.getWalletBalance('coldwallet');

    // Wallet Balances
    const hotBalance: number = hotBalReq.data?.result;
    const coldBalance: number = coldBalReq.data?.result;

    const total = coldBalance + hotBalance;

    // Get wallet balance percentages
    const hotPercentage = Math.floor(hotBalance * 100 / total);
    const coldPercentage = Math.floor(coldBalance * 100 / total);

    
    if (coldPercentage < coldWallet && hotPercentage > hotWallet) {
        // calculate the amount to withdraw from hotwallet
        const perToWithdraw = hotPercentage - hotWallet;
        const amountToWithdraw = Math.floor(hotBalance * perToWithdraw / hotPercentage);

        // Get new coldwallet address
        const { data } = await bitrpc.getNewAddress('coldaddress', addressType.bech32, 'coldwallet');
        const address = data.result;

        // Send amount to cold wallet address
        await bitrpc.createTransaction('hotwallet', address, amountToWithdraw);
        
    } else if (coldPercentage > coldWallet && hotPercentage < hotWallet) {
        // calculate the amount to withdraw from coldwallet
        const perToWithdraw = coldPercentage - coldWallet;
        const amountToWithdraw = Math.floor(coldBalance * perToWithdraw / coldPercentage);

        // Get new hotwallet address
        const { data } = await bitrpc.getNewAddress('hotaddress', addressType.bech32, 'hotwallet');
        const address = data.result;

        // Send amount to hot wallet address
        await bitrpc.createTransaction('coldwallet', address, amountToWithdraw);
    }
}