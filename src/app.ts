import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from 'routes/auth.routes';

export const app = express();
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use("/",authRouter)
