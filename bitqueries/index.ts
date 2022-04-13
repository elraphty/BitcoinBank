import Addresses from "./addresses";
import Auth from "./auth";
import Blocks from "./blocks";
import Blockchain from "./blockchain";
import Transactions from "./transactions";
import Wallet from "./wallet";
import { AxiosResponse } from "axios";

export default class BitQueries extends Auth {
    blocks: Blocks;
    addresses: Addresses;
    blockchain: Blockchain;
    transactions: Transactions;
    wallet: Wallet;

    constructor(user: string | undefined, pass: string | undefined, rpcurl: string | undefined, port: number | undefined) {
        super(user, pass, rpcurl, port);
        this.blocks = new Blocks(this.user, this.pass, this.rpcurl, this.port);
        this.addresses = new Addresses(this.user, this.pass, this.rpcurl, this.port);
        this.blockchain = new Blockchain(this.user, this.pass, this.rpcurl, this.port);
        this.transactions = new Transactions(this.user, this.pass, this.rpcurl, this.port);
        this.wallet = new Wallet(this.user, this.pass, this.rpcurl, this.port);
    }

    getBlockchainInfo(): Promise<AxiosResponse> {
        return this.blockchain.getBlockchainInfo();
    }

    /** Address Queries */

    /** End Of Address Queries */

    /** Block Queries */
    getBlockHash(index: number): Promise<AxiosResponse> {
        return this.blocks.getBlockHash(index);
    }

    getBlock(hash: string): Promise<AxiosResponse> {
        return this.blocks.getBlock(hash);
    }
    /** End Of Block Queries */

    /** Transaction Queries */
    getTransaction(txId: string): Promise<AxiosResponse> {
        return this.transactions.getTransaction(txId);
    }

    decodeRawTransaction(transactionHex: symbol): Promise<AxiosResponse> {
        return this.transactions.decodeRawTransaction(transactionHex);
    }
    /** End Of Transaction Queries */

    /** Wallet Queries */
     getWalletBalance(name: string): Promise<AxiosResponse> {
        return this.wallet.getWalletBalance(name);
    }
    /** End Of Wallet Queries */
}