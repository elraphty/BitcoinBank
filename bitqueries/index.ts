import dotenv from 'dotenv';
import QueryBase from "./base";

dotenv.config();

const USER = process?.env.RPC_USER;
const PASS = process?.env.RPC_PASS;
const RPCPORT = process?.env.RPC_PORT;
const RPCURL = process?.env.RPC_URL;


const base: QueryBase = new QueryBase(USER, PASS, RPCURL, Number(RPCPORT));

export default base;