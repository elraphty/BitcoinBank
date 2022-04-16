import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Wallet extends BitAuth { 
    createWallet(name: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'createwallet',
            params: [name],
        }; 

        return axios.post(this.url, body, headers);
    }
    
    listWallets(): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'listwallets',
            params: [],
        };

        return axios.post(this.url, body, headers);
    }

    getWalletBalance(wallet: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getbalance',
            params: [],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }

    getTransactions(wallet: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'listtransactions',
            params: [],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }
}