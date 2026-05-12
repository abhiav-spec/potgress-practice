
import express from "express";

const router = express.Router();

// Basic payment route stub
router.get("/", (req, res) => {
	res.status(200).json({ success: true, message: "Payment routes" });
});

export default router;
