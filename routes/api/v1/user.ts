import express, { Router } from 'express';
import { registerUser, userLogin } from '../../../controllers/user';
import { createUser } from '../../../helpers/validators/user';

const router: Router = express.Router();

router.post('/register', createUser, registerUser);

router.post('/login', createUser, userLogin);

export default router;