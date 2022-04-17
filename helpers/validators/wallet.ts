import { body } from 'express-validator';

const myWhitelist: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#@.';

export const transactionCreate = [
  body('recipient')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Enter a valid bitcoin address'),
  body('amount')
    .not().isEmpty()
    .isDecimal()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .withMessage('Enter amount'),
]