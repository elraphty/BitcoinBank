# Bitcoin bank
### A Bitcoin bank project built with Bitcoin Core and Typescript

## Requirements

 - Nodejs version 14.19.0 minimum
 - A Running Bitcoin Core node on Signet or Testnet network
 - PostgresDB installed

## How It Works

 - This project works with 2 bitcoin wallets: a cold and hotwallet, ideally the cold wallet is supposed 
   to be a coldstorage  but for the purpose of this project we will use 2 Bitcoin core wallets.
   When you run the project ```npm run dev``` it checks for the amount of wallets on your node if none it creates 2 wallets named coldwallet, and hotwallet, if one wallet is available it creates one wallet named hotwallet. You can set the wallet names in the .env ```HOTWALLETNAME= COLDWALLETNAME=``` file if you have wallets already on your node and they are not named coldwallet and hotwallet.
    
 - Every 1 hour a check is done to make sure the hotwallet has 20% of the total funds while the rest of the 
   80% is in the cold wallet, if the hotwallet has more than 20% the amount of the percentage excess will be transferred to the cold wallet, also if the coldwallet has 80% the amount of the percentage that exceeds 80% will be transferred to the hotwallet

 - When u create a user using the api/v1/user/register endpoint it creates a new segwit user to the database table

 - Outbound transactions uses Bitcoin's JSON RPC ```sendtoaddress``` command to create and broadcast a transaction

 - Inbound Transactions are checked every 10 mins (Bitcoin's block time) after the confirmation meets 
   the confirmation count specified in the .env it updates the user's balance and create a new address for them

## How to Run

 - Clone the project ```git clone https://github.com/elraphty/BitcoinBank.git```
 - Run ```npm install```
 - Install knex globally ```npm install knex -g```
 - Start your Bitcoin Core node by running  ```bitcoind``` in your termainal
 - Confirm if your node is running using ```bitcoin-cli -getinfo``` command
 - Create a .env file copy the variables in .env_sample file paste them in ur newly created .env file and update the values
 - Migrate Database schemas by running ```knex migrate:latest```
 - Run ```npm run dev``` in the project folder

## API ROUTES

 - GET /api/v1 = Base Route
 - POST /api/v1/user/register = Register lser
 - POST /api/v1/user/login = User login
 - GET /api/v1/user/address = Get user bitcoin segwit address for inbound transactions
 - GET /api/v1/user/balance = Get user bitcoin balance
 - POST /api/v1/wallet/createtransaction = Create outbound transaction
 - GET /api/v1/wallet/transactions = Get user transactions


