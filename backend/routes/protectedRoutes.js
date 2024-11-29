import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get('/protected', verifyToken, async (req, res) => {
    try {
        console.log("Protected route accessed by:", req.user)
        res.json({
            success: true,
            message: "Access granted",
            user: req.user
        });
        console.log("Access granted")
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
});

export default router;
