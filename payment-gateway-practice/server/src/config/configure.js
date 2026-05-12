import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT ,
  DATABASE_URL: process.env.DATABASE_URL
};

if(!config.PORT || !config.DATABASE_URL) {
  throw new Error("Missing required environment variables");
}

export default config;
