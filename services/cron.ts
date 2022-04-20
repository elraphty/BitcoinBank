import { getReceived, checkWalletBalances } from "./functions";

export const cron = () => {
    setInterval(async () => {
        getReceived();
        checkWalletBalances();
    }, 1000 * 60 * 10);
}