import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
    throw result.error;
}

const config = {
     PORT: process.env.PORT || 3000,
    DATABASE_URL: process.env.DATABASE_URL
};

export default config;