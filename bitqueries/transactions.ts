import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Transactions extends BitAuth {
    getTransaction(transactionId: string, wallet: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'gettransaction',
            params: [transactionId],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers );
    }

    decodeRawTransaction(transactionHex: symbol): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'decoderawtransaction',
            params: [transactionHex],
        };

        return axios.post(this.url, body, headers );
    }

    listUnspent(): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'listunspent',
            params: [],
        };

        return axios.post(this.url, body, headers);
    }

    createTransaction(wallet: string, address: string, amount: number, feerate: number = 1): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'sendtoaddress',
            params: [address, amount, '', '', false, true, null, "unset", null, feerate],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }

    getFeeEstimate(target: number): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'estimatesmartfee',
            params: [target],
        };

        return axios.post(this.url, body, headers);
    }

    setTransactionFee(wallet: string, fee: number): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'settxfee',
            params: [fee],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }
};