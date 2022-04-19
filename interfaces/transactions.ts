
interface ScriptPubkey {
    addresses: string[];
    type: string;
    asm: string;
    pubKey: string;
    reqSigs: number;
}

export interface Vout {
    value: number;
    n: number;
    scriptPubKey: ScriptPubkey;
}

export interface Vin {
    txid?: string;
    vout?: number;
    scriptSig?: {
        asm: string;
        hex: string;
    };
    txinwitness: string[];
    is_coinbase: boolean;
    sequence: number;
}

interface TransactionDetails {
    address: string;
    category: string;
    amount: number;
    label: string;
    vout: number;
};

export interface TransactionResult {
    address: string;
    category: string;
    fee: number;
    details?: {
        fee: number;
    };
    amount: number;
    label: string;
    vout: number;
    confirmations: number;
    generated: boolean;
    blockhash: string;
    blockheight: number;
    blockindex: number;
    blocktime: number;
    txid: string;
    walletconflicts: any[],
    time: number;
    timereceived: number;
    'bip125-replaceable': string;
}

export interface RawTransaction {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: Vin[];
    vout: Vout[];
}

export interface UTXO {
    txid: string;
    vout: 0;
    address: string,
    label: string;
    scriptPubkey: string;
    amount: number;
    confirmations: number;
    spendable: boolean;
    solvable: true;
    desc: string;
    safe: boolean;
}