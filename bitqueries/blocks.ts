import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';

export default class Blocks extends BitAuth {
    getBlockHash(block: number): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockhash',
            params: [block],
        };

        return axios.post(this.url, body, headers);
    }

    getBlock(blockHash: string): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblock',
            params: [blockHash],
        };

        return axios.post(this.url, body, headers);
    }
};