import  pkg from 'pg';
import config from './configure';


const { Pool } = pkg;

const pool = new Pool({
    connectionString: config.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch((error) => console.error('Error connecting to PostgreSQL database:', error));

export default pool;
