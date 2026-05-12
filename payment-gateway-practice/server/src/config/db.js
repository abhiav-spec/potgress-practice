import pkg from "pg";
import config from "./configure.js";

const { Pool } = pkg;



const pool = new Pool({
  connectionString: config.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});



// POOL ERROR HANDLER
pool.on("error", (error) => {

  console.error(
    "Unexpected PostgreSQL pool error:",
    error
  );

});



/**
 * Connect PostgreSQL Database
 */
export const connectDB = async () => {

  try {

    await pool.connect();

    console.log(
      "Connected to PostgreSQL database"
    );

  } catch (error) {

    console.error(
      "Database connection failed:",
      error.message
    );

    
  }

};



export default pool;