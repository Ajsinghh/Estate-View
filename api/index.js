const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
const listingRouter = require('./routes/listing.route.js')
const cookieParser = require('cookie-parser')
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000,()=> console.log("server is running on port 3000"));

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success : false,
    statusCode,
    message,
  })
});