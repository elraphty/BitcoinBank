export interface User {
    id?: number;
    token?: string;
    username: string;
    password?: string;
}
export interface UserAddress {
    id?: number;
    userid?: number;
    receiveaddress: string;
}
export interface UserBalance {
    id?: number;
    userid: number;
    amount: number;
}

export interface TransactionLogs {
    id?: number;
    amount: number;
    txid: string;
    status: number;
    type: string;
    userid?: number;
}