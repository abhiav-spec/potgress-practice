import pkg from "pg";
import config from "./configure.js";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});




export default pool;
