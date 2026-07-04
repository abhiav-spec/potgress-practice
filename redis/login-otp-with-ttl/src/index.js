import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

function generateOTP(phone) {
    return `opt:${phone}`;
}

app.post("/send-otp", async (req, res) => {
    const { phone } = req.body || {};
    if (!phone) {
        return res.status(400).json({ error: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(generateOTP(phone), otp, "EX", 300); // OTP expires in 5 minutes

    // Here you would send the OTP to the user's phone number via SMS
    console.log(`Sending OTP ${otp} to phone number ${phone}`);

    res.json({ message: `OTP sent successfully ${otp}` });
});


app.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body || {};
    if (!phone || !otp) {
        return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const storedOtp = await redis.get(generateOTP(phone));

    if (storedOtp === otp) {
        await redis.del(generateOTP(phone)); // Delete OTP after successful verification
        return res.json({ message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ error: "Invalid OTP" });
    }
});

app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;

    const ttl = await redis.ttl(generateOTP(phone));

    res.json({ ttl });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});