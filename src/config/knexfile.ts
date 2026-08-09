import type { Knex } from 'knex';
import { config } from './env';
import path from 'path';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '../database/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, '../database/seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '../database/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, '../database/seeds'),
      extension: 'ts',
    },
  },
};

export default knexConfig;
