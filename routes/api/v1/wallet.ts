import express, { Router } from 'express';
import { createTransaction, listTransactions } from '../../../controllers/wallet';
import { authUser } from '../../../helpers/auth';
import { transactionCreate } from '../../../helpers/validators/wallet';

const router: Router = express.Router();

router.post('/createtransaction', transactionCreate, authUser, createTransaction);

router.get('/transactions', authUser, listTransactions);

export default router;