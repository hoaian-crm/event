import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { CreateTableEvents1700582766301 } from './1700582766301-CreateTableEvents';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: +(process.env.PG_PORT || 5432),
  entities: [],
  migrations: [CreateTableEvents1700582766301],
});
