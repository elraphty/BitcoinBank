import express, {Router} from 'express';
import wallet from './wallet';
import user from './user';

const router: Router = express.Router();

router.use('/user', user);

router.use('/wallet', wallet);

export default router;