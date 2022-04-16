export interface User {
    id?: number;
    username: string;
    password?: string;
}

export interface UserAddress {
    id?: number;
    userid: number;
    receiveaddress: string;
}
export interface UserBalance {
    id?: number;
    userid: number;
    amount: number;
}