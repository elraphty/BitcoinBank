import bitrpc from '../bitqueries';
import { TransactionResult } from '../interfaces/transactions';
import dotenv from 'dotenv';
import knex from '../db';
import { TransactionLogs, UserAddress, UserBalance } from '../interfaces/db';
import { addressType } from '../interfaces/addresses';
import { coldwalletname, hotwalletname } from '../config';

dotenv.config();

const noOfCon = Number(process.env.NO_OF_CONFIRMATIONS);

// Generate a new address
const getNewAddress = async (userId: number | undefined) => {
    try {
        const { data } = await bitrpc.getNewAddress('useraddress', addressType.bech32, hotwalletname);
        const address = data.result;

        // Update user address
        await knex<UserAddress>('useraddresses').update({ receiveaddress: address }).where({ userid: userId });
        // Add address to address log
        await knex<UserAddress>('addresslogs').insert({ userid: userId, receiveaddress: address });
    } catch (err) {
        // Log Error
        console.log('Generate New Address Error ===', (err as Error).message);
    }
}

// Update Balance and Transaction logs
const updateBAndT = async (userId: number | undefined, txid: string, amount: number) => {
    try {
        // Update the User's Balance with the transaction amount
        await knex<UserBalance>('usersbalance').update({ amount: knex.raw(`amount + ${amount}`) }).where({ userid: userId });

        // Update the transaction status in transaction log
        await knex<TransactionLogs>('transactionlogs').update({ status: 1 }).where({ txid: txid });
    } catch (err) {
        // Log Error
        console.log('Update Balance Error ===', (err as Error).message);
    }
}

export const getReceived = async () => {
    try {
        const transactions: TransactionResult[] = await (await bitrpc.getTransactions(hotwalletname)).data.result;

        transactions.forEach(async trans => {
            // Set the user address
            const userAddress: string = trans.address;

            // Get the user with the address, if the uset is existent update their balance 
            const user: UserAddress[] = await knex<UserAddress>('addresslogs').where({ receiveaddress: userAddress });

            if (user.length === 1) {
                const userId: number | undefined = user[0].userid;

                 // Check if the transaction has been added to the database log, if not add it
                 const alltrans: TransactionLogs[] = await knex<TransactionLogs>('transactionlogs').where({ txid: trans.txid });

                // If the transaction is a receive category
                if (trans.category === 'receive') {
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
                if (trans.confirmations === noOfCon && Number(alltrans[0].status) === 0) {
                    // Update transaction logs and balance
                    await updateBAndT(userId, trans.txid, trans.amount);

                    // Generate new address for the user
                    await getNewAddress(userId);
                } else if (trans.confirmations > noOfCon) {
                    // If the confirmation is greater than no of confirmation and it is not existent in our users transaction logs
                    if (alltrans.length === 1 && Number(alltrans[0].status) === 0) {
                        // Update transaction logs and balance
                        await updateBAndT(userId, trans.txid, trans.amount);

                        // Generate new address for the user
                        await getNewAddress(userId);
                    }
                }
            }
        });
    } catch (err) {
        // Log Error
        console.log('Wallet Receive Error ===', (err as Error).message);
    }
}

/** The hotwallet should have 20% of the total funds while 
 * the rest of the 80% should be in the cold wallet */
export const checkWalletBalances = async () => {
    try {
        const coldWallet: number = 80;
        const hotWallet: number = 20;

        const hotBalReq = await bitrpc.getWalletBalance(hotwalletname);
        const coldBalReq = await bitrpc.getWalletBalance(coldwalletname);

        // Wallet Balances
        const hotBalance: number = hotBalReq.data?.result;
        const coldBalance: number = coldBalReq.data?.result;

        const total: number = coldBalance + hotBalance;

        // Calculate wallet balance percentages
        const hotPercentage: number = Math.floor(hotBalance * 100 / total);
        const coldPercentage: number = Math.floor(coldBalance * 100 / total);

        if (coldPercentage === coldWallet && hotPercentage === hotWallet) {
            return;
        } else if (coldPercentage < coldWallet && hotPercentage > hotWallet) {
            // calculate the amount to withdraw from hotwallet
            const perToWithdraw: number = hotPercentage - hotWallet;
            const amountToWithdraw: number = hotBalance * perToWithdraw / hotPercentage;

            // Get new coldwallet address
            const { data } = await bitrpc.getNewAddress('coldaddress', addressType.bech32, coldwalletname);
            const address = data.result;

            // Send amount to cold wallet address
            await bitrpc.createTransaction('hotwallet', address, amountToWithdraw);

        } else if (coldPercentage > coldWallet && hotPercentage < hotWallet) {
            // Calculate the amount to withdraw from coldwallet
            const perToWithdraw: number = coldPercentage - coldWallet;
            const amountToWithdraw: number = coldBalance * perToWithdraw / coldPercentage;

            // Get new hotwallet address
            const { data } = await bitrpc.getNewAddress('hotaddress', addressType.bech32, hotwalletname);
            const address = data.result;

            // Send amount to hot wallet address
            await bitrpc.createTransaction('coldwallet', address, amountToWithdraw);
        }
    } catch (err) {
        // Log Error
        console.log('Wallet Balance Error ===', (err as Error).message);
    }
}