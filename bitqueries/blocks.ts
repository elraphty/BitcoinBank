import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';
import { BlockResult } from '../interfaces/blocks';
import { UTXO } from '../interfaces/transactions';

export default class Blocks extends BitAuth {
    getBlockchainInfo(): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockchaininfo',
            params: [],
        };

        return axios.post(this.url, body, headers);
    }

    getBlockHash(block: number): Promise<AxiosResponse> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockhash',
            params: [block],
        };

        return axios.post(this.url, body, headers);
    }

    getBlock(blockHash: string): Promise<BlockResult> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblock',
            params: [blockHash],
        };

        return axios.post(this.url, body, headers);
    }

    listUnspent(): Promise<UTXO> {
        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'listunspent',
            params: [],
        };

        return axios.post(this.url, body, headers);
    }
};