import { AxiosResponse } from 'axios';
import bitrpc from '../bitqueries';

/** Check if the node has up to 2 wallets if not create them */
export const walletCheck = async () => {
    try {
        const res: AxiosResponse = await bitrpc.listWallets();
        const wallets: string[] = res.data.result;

        // If the wallets is greater than 2 do nothing
        if (wallets.length >= 2) { }
        // if the wallet is 1 create one more wallet else create 2 wallets
        else if (wallets.length === 1) {
            bitrpc.createWallet('coldwallet');
        } else {
            const reqs: Promise<AxiosResponse>[] = [];
            for (let i = 0; i < 2; i++) {
                let req: Promise<AxiosResponse>;
                if (i === 0) {
                    req = bitrpc.createWallet('hotwallet');
                    reqs[i] = req;
                } else if (i === 1) {
                    req = bitrpc.createWallet('coldwallet');
                    reqs[i] = req;
                }

                await Promise.all(reqs);
            }
        }
    } catch (err) {
        // Log error
        console.log('Wallet Error ===', (err as Error).message);
    }
}