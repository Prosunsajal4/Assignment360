import knex, { Knex } from 'knex';
import knexConfig from './knexfile';
import { config } from './env';

const environment = config.nodeEnv || 'development';
const connectionConfig = knexConfig[environment];

if (!connectionConfig) {
  throw new Error(`Knex configuration not found for environment: ${environment}`);
}

const db: Knex = knex(connectionConfig);

export default db;
export { db };
