import express, { Router } from 'express';
import { createTransaction } from '../../../controllers/wallet';
import { authUser } from '../../../helpers/auth';
import { transactionCreate } from '../../../helpers/validators/wallet';

const router: Router = express.Router();

router.post('/createtransaction', transactionCreate, authUser, createTransaction);

export default router;