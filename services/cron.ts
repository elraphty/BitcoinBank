import bitrpc from '../bitqueries';

export const getReceived = () => {
    return setInterval(async () => {
    const wallets = await (await bitrpc.listWallets()).data.result;

    const transactions = await (await bitrpc.getTransactions(wallets[0])).data.result;

    // console.log('Transactions ====', transactions);
    }, 1000 * 10);
}