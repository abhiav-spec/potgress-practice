import dotenv from "dotenv";
dotenv.config();

const config = {
  Razorpay_KEY_ID: process.env.RAZORPAY_KEY_ID,
  Razorpay_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  PORT: process.env.PORT ,
  DATABASE_URL: process.env.DATABASE_URL
};

if(!config.PORT || !config.DATABASE_URL) {
  throw new Error("Missing required environment variables");
}

if(!config.Razorpay_KEY_ID || !config.Razorpay_KEY_SECRET) {
  throw new Error("Missing Razorpay credentials in environment variables");
}

export default config;
