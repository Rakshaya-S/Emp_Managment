import jwt from "jsonwebtoken"

function verifyToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1]; 
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
        
    }

    try {        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(403).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
}

export default verifyToken;