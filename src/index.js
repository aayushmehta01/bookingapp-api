import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/index.js';
import authRoute from './routes/auth.js'
import hotelsRoute from './routes/hotels.js'
import usersRoute from './routes/users.js'
import roomsRoute from './routes/rooms.js'

dotenv.config({
    path: './env'
})

const app = express();

app.get('/', (req, res)=>{
    res.send('Server running');
})

// use middlewares

app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);


app.listen(process.env.PORT || 8000, ()=>{
    connectDB();
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});