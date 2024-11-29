import express from "express";

const router=express.Router();

router.post("/welcome",(req,res)=>{
    console.log(req);
});

export default router;