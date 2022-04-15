import express, { Router } from 'express';
import { registerUser } from '../../../controllers/user';
import { createUser } from '../../../helpers/validators/user';

const router: Router = express.Router();

router.post('/register', createUser, registerUser);

export default router;