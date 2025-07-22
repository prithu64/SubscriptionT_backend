import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors())
app.use(express.json())


import userRouter from './routes/user.routes.js';
import subsRouter from './routes/subscription.routes.js'

app.use("api/v1/user",userRouter)
app.use("api/v1/subs",subsRouter)

export { app }

