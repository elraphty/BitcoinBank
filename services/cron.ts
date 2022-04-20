import { getReceived, checkWalletBalances } from "./cronfunctions";

export const cron = () => {
    setInterval(async () => {
        getReceived();
        checkWalletBalances();
    }, 1000 * 60 * 10);
}