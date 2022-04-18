import { User } from '../../interfaces/db';

declare module 'express-session' {
    interface SessionData {
        user: User;
    }
}