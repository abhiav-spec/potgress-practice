import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const app = express();

app.get("/", async (req, res) => {
    const reply = await redis.ping();
    res.json({ message: `Redis ping response: ${reply}` });
});

app.get("/mongo", async (req, res) => {
    try {
       if(!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/test");
       }
        res.json({ message: "Connected to MongoDB successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to MongoDB", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});