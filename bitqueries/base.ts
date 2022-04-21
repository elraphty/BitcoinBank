import Addresses from "./addresses";
import Auth from "./auth";
import Blocks from "./blocks";
import Blockchain from "./blockchain";
import Transactions from "./transactions";
import Wallet from "./wallet";
import { AxiosResponse } from "axios";
import { addressType } from "../interfaces/addresses";

export default class QueryBase extends Auth {
    blocks: Blocks;
    addresses: Addresses;
    blockchain: Blockchain;
    transactions: Transactions;
    wallet: Wallet;
    address: Addresses;

    constructor(user: string | undefined, pass: string | undefined, rpcurl: string | undefined, port: number | undefined) {
        super(user, pass, rpcurl, port);
        this.blocks = new Blocks(this.user, this.pass, this.rpcurl, this.port);
        this.addresses = new Addresses(this.user, this.pass, this.rpcurl, this.port);
        this.blockchain = new Blockchain(this.user, this.pass, this.rpcurl, this.port);
        this.transactions = new Transactions(this.user, this.pass, this.rpcurl, this.port);
        this.wallet = new Wallet(this.user, this.pass, this.rpcurl, this.port);
        this.address = new Addresses(this.user, this.pass, this.rpcurl, this.port);
    }

    getBlockchainInfo(): Promise<AxiosResponse> {
        return this.blockchain.getBlockchainInfo();
    }

    /** Address Queries */
    getNewAddress(label: string, type: addressType, wallet: string): Promise<AxiosResponse> {
        return this.address.getNewAddress(label, type, wallet);
    }
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
    getTransaction(txId: string, wallet: string): Promise<AxiosResponse> {
        return this.transactions.getTransaction(txId, wallet);
    }
    decodeRawTransaction(transactionHex: symbol): Promise<AxiosResponse> {
        return this.transactions.decodeRawTransaction(transactionHex);
    }
    createTransaction(wallet: string, address: string, amount: number, feerate: number = 1): Promise<AxiosResponse> {
        return this.transactions.createTransaction(wallet, address, Number(amount.toFixed(8)), feerate);
    }
    getFeeEstimate(target: number): Promise<AxiosResponse> {
        return this.transactions.getFeeEstimate(target);
    }
    setTransactionFee(wallet: string, txfee: number): Promise<AxiosResponse> {
        return this.transactions.setTransactionFee(wallet, txfee);
    }
    /** End Of Transaction Queries */

    /** Wallet Queries */
    createWallet(name: string): Promise<AxiosResponse> {
        return this.wallet.createWallet(name);  
    }
    listWallets(): Promise<AxiosResponse> {
        return this.wallet.listWallets();
    }
    getWalletBalance(name: string): Promise<AxiosResponse> {
        return this.wallet.getWalletBalance(name);
    }
    getTransactions(name: string): Promise<AxiosResponse> {
        return this.wallet.getTransactions(name);
    }
    /** End Of Wallet Queries */
}