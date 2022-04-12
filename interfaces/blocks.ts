export interface BlockResult {
    hash: string;
    confirmations: number;
    height: number;
    version: boolean;
    versionHex: string;
    merkleroot: string;
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty:  number;
    chainwork: number;
    nTx: number;
    previousblockhash: string;
    nextblockhash: string;
    strippedsize: number;
    size: number;
    weight: number;
    tx: string[];
}