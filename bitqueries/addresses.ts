import axios, { AxiosResponse } from 'axios';
import BitAuth from './auth';
import headers from '../helpers/datafile';
import { addressType } from '../interfaces/addresses';
export default class Addresses extends BitAuth { 
    getNewAddress(label: string, type: addressType, wallet: string): Promise<AxiosResponse> {
        let _type: string =  '';
        switch(type) {
            case 'p2pkh': _type = 'legacy';
            break;
            case 'p2sh': _type = 'p2sh-segwit';
            break;
            default: _type = 'bech32';
        }

        const body = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getnewaddress',
            params: [label, _type],
        };
        return axios.post(`${this.url}wallet/${wallet}`, body, headers);
    }
}