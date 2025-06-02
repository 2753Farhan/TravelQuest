import knex from "knex";

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

if (!process.env.PG_CONNECTION_STRING) {
  throw new Error('Missing PG_CONNECTION_STRING in environment variables');
}

const config = {
  development: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'migrations')
    },
    // seeds: {
    //   directory: path.resolve(__dirname, 'seeds')
    // }
  },

 
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'migrations')
    }
  }
};

export const db = knex(config.development);