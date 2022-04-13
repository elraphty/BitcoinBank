import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Wallet extends BitAuth { 
    getWalletBalance(wallet: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getbalance',
            params: [],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }
}