import dotenv from 'dotenv'
dotenv.config({
    path : './.env'
})

import { app } from "./app.js";
import connectDB from './db/db.js';

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(` server is running at PORT ${process.env.PORT}`)
    })
})

