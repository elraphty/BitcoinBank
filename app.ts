import express, { Application, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import CurlBlocks from './bitqueries/blocks';
import { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process?.env.RPC_PASS;

const curlblocks = new CurlBlocks(USER, PASS);

curlblocks.getBlockHash(1).then((res: AxiosResponse) => console.log('Get Block Hash Result ===', res.data.result)).catch(e => console.log('Get Blockhash Errror', e.message));

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