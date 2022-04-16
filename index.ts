import app from "./app";
import session from 'express-session';

const PORT = process.env.PORT || 8000;

app.use(session({
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.listen(PORT, (): void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});