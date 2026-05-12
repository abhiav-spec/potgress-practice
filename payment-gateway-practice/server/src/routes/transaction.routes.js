
import express from "express";

const router = express.Router();

// Basic transaction route stub
router.get("/", (req, res) => {
	res.status(200).json({ success: true, message: "Transaction routes" });
});

export default router;
