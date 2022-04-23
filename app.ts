import express, { Application, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import { walletCheck } from './services/wallet';
import { responseError } from './helpers';
import { cron } from './services/cron';

const app: Application = express();

// App middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Router files
app.use('/', routes);

// Base error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        responseError(res, 500, err.message);
    }
});

try {
    walletCheck();
    cron();
} catch (err) {
    // Log error
    console.log('App Error ===', (err as Error).message);
}

export default app;