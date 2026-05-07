import pkg from 'pg';
import config from './configure.js';


const { Pool } = pkg;

const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error:', error);
});

pool.query('SELECT 1')
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((error) => console.error('Error connecting to PostgreSQL database:', error));

export default pool;
