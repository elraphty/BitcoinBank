import { getReceived, checkWalletBalances } from "./cronfunctions";

export const cron = () => {
    // Check for receive transactions every 10 minutes
    setInterval(() => {
        getReceived();
    }, 1000 * 60 * 10);

    // Check the wallet balance every 1 hour
    setInterval(() => {
        checkWalletBalances();
    }, 1000 * 60 * 60);
}