import pg from "pg";
import dotenv from "dotenv"
import { connect } from "mongoose";

dotenv.config();

const db=new pg.Client({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASS,
    port:process.env.DB_PORT
})
function connectdb(){
    try{
        db.connect();
        console.log("DB connected");
        
    }catch(err){
        console.log("error while connecting to db",err);
    }
}

export {connectdb,db};