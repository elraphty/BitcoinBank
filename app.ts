import express, { Application, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { walletCheck } from './services/wallet';
import bitrpc from './bitqueries';
import { AxiosResponse } from 'axios';
import { BlockResult } from './interfaces/blocks';
import { addressType } from './interfaces/addresses';
import { responseError } from './helpers';

// walletCheck();

// bitrpc.getWalletBalance('raphwallet').then((res: AxiosResponse) => console.log('Get Wallet Balance Result ===', res.data.result)).catch(e => console.log('Get Blockhash Errror', e.message));

// bitrpc.getBlockHash(1).then((res: AxiosResponse) => console.log('Get Block Hash Result ===', res.data.result)).catch(e => console.log('Get Blockhash Errror', e.message));

// bitrpc.getBlock('586604a345c2ac49491ffe63f045cb15d4cc64b2d2ab3055672562e05d4c09c8')
//     .then((res: AxiosResponse) => {
//         const result: BlockResult = res.data.result;
//         console.log('Get Block Result ===', result)
//     })
//     .catch(e => console.log('Get Blockhash Errror', e.message));

// bitrpc.getTransaction('dedbbdcf5c73eaf4fb5e2e1be8a9b8a719cc117f004aa6d3aa9385d3359e203e', 'raphwallet')
//     .then((res: AxiosResponse) => {
//         const result: BlockResult = res.data.result;
//         console.log('Get Transaction Result ===', result)
//     })
//     .catch(e => console.log('Get Transaction Errror', e.message));

// bitrpc.getNewAddress('user', addressType['bech32'], 'hotwallet')
//     .then((res: AxiosResponse) => {
//         const result: BlockResult = res.data.result;
//         console.log('Get Address Result ===', result)
//     })
//     .catch(e => console.log('Get Address Errror', e.message));

const app: Application = express();

// App middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router files
app.use('/', routes);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        responseError(res, 500, err.message);
    }
});

export default app;