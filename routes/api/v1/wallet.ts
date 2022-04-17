import express, { Router } from 'express';
import { createTransaction } from '../../../controllers/wallet';
import { transactionCreate } from '../../../helpers/validators/wallet';

const router: Router = express.Router();

router.post('/createtransaction', transactionCreate, createTransaction);

export default router;