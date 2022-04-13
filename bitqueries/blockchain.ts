import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Blockchain extends BitAuth { 
    getBlockchainInfo(): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockchaininfo',
            params: [],
        };

        return axios.post(this.url, body, headers);
    }
}