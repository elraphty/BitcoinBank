import { body } from 'express-validator';

const myWhitelist: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_#@.';

export const createUser = [
  body('username')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .isLength({min: 5})
    .withMessage('Enter a username with a minimum of five characters '),
  body('password')
    .not().isEmpty()
    .isString()
    .ltrim()
    .rtrim()
    .whitelist(myWhitelist)
    .escape()
    .isLength({min: 6})
    .withMessage('Password length must be up to six characters'),
]