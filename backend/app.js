import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {connectdb} from "./connectdb.js";
import login from "./routes/login.js";
import createUser from "./routes/createUser.js";
import protectedRoutes from "./routes/protectedRoutes.js"
import cors from "cors"
import jwt from "jsonwebtoken"


dotenv.config();
const app=express();
const port=process.env.PORT;
connectdb();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.get('/api/currentUser', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            res.json({ success: true, data: decoded });
        });
    } else {
        res.status(400).json({ success: false, message: 'No token provided' });
    }
});
app.use("/api",protectedRoutes);
app.use("/api",login);
app.use("/api",createUser)




app.listen(port,()=>{
    console.log(`Server is listening to port : ${port}`);  
})