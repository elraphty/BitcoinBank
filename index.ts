import dotenv from 'dotenv';
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, (): void => {
    console.log(`Server Running here 👉 https://localhost:${PORT}`);
});