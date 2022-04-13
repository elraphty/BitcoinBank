import express, { Application, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import BitRpc from './bitqueries';
import { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { BlockResult } from './interfaces/blocks';

dotenv.config();

const USER = process?.env.RPC_USER;
const PASS = process?.env.RPC_PASS;
const RPCPORT = process?.env.RPC_PORT;
const RPCURL = process?.env.RPC_URL;

const bitrpc = new BitRpc(USER, PASS, RPCURL, Number(RPCPORT));

// bitrpc.getWalletBalance('testwallet').then((res: AxiosResponse) => console.log('Get Wallet Balance Result ===', res.data.result)).catch(e => console.log('Get Blockhash Errror', e.message));

// bitrpc.getBlockHash(1).then((res: AxiosResponse) => console.log('Get Block Hash Result ===', res.data.result)).catch(e => console.log('Get Blockhash Errror', e.message));

// bitrpc.getBlock('586604a345c2ac49491ffe63f045cb15d4cc64b2d2ab3055672562e05d4c09c8')
//     .then((res: AxiosResponse) => {
//         const result: BlockResult = res.data.result;
//         console.log('Get Block Result ===', result)
//     })
//     .catch(e => console.log('Get Blockhash Errror', e.message));

const app: Application = express();

// App middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // responseError(res, 500, err.message);
    }
});

export default app;