import express from "express";
import { db } from "../connectdb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const result = await db.query("SELECT * FROM employee WHERE username=$1",[username]);        
        if(result.rows.length===0){
            return res.json({
                success:false,
                message:"User doesn't exist"
            })
        }       
        const user=result.rows[0];
        const hashedPass=user.password
        
        const passcheck=await bcrypt.compare(password,hashedPass) 
        
        if(passcheck){
            const token=jwt.sign(
                {username:user.username,id:user.id,role:user.role},
                process.env.JWT_SECRET,
                {expiresIn:"1h"}
            )
            res.json({
                success:true,
                message:"login successful",
                token
            })
        }else{
            res.json({
                success:false,
                message:"incorrect password"
            })
        }
    } catch (err) {
        console.log(err);
    }
});

export default router;