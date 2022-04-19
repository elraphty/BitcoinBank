import express, { Application, Response, Request, NextFunction, Errback } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { walletCheck } from './services/wallet';
import bitrpc from './bitqueries';
import { AxiosResponse } from 'axios';
import { BlockResult } from './interfaces/blocks';
import { addressType } from './interfaces/addresses';
import { responseError } from './helpers';
import { getReceived } from './services/cron';

try {
    walletCheck();
    getReceived();
} catch (err) {
    console.log('Error ===', (err as Error).message);
}

// bitrpc.createTransaction('hotwallet', 'tb1qm6x3lgdjemat00xjep4zf6ppkttpudg3jh8wtt', 0.0001).then((res: AxiosResponse) => console.log('Transaction Success ===', res.data.result)).catch(e => console.log('Transaction Error', e));

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