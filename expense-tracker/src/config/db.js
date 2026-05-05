const {pool} = require('pg')
require('dotenv').config()

const pool = new pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


try {
    await pool.connect()
    console.log("Connected to PostgreSQL database");
} catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
}

export default pool;


