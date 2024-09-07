import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './db/index.js';
import authRoute from './routes/auth.routes.js'
import hotelsRoute from './routes/hotel.routes.js'
import usersRoute from './routes/user.routes.js'
import roomsRoute from './routes/room.routes.js'

// testing git

dotenv.config({
    path: './env'
})

const app = express();

app.get('/', (req, res)=>{
    res.send('Server running');
})

// use middlewares

app.use(cors({
    origin: 'localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})


app.listen(process.env.PORT || 8000, ()=>{
    connectDB();
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});