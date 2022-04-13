import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Addresses extends BitAuth { 
    getNewAddress(label: string, type: string, wallet: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getnewaddress',
            params: [label, type],
        };

        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }
}