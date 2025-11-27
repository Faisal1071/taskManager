import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: "devuser",
  host: "localhost",
  database: "tasksdb",
  password: "devpass",
  port: 5432,
});
