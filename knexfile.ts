import path from 'path';
import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

export const development: Knex.Config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASS,
        database: process.env.DEV_DB_NAME,
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds')
    }
};

export const test: Knex.Config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
    },
    migrations: {
        directory: path.join(__dirname, '/db/migrations')
    },
    seeds: {
        directory: path.join(__dirname, '/db/seeds')
    }
};
