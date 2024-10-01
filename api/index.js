const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.route.js')
const authRouter = require('./routes/auth.route.js')
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
    console.log("HEY");
  });
const app = express();

app.use(express.json());

app.listen(3000,()=> console.log("server is running on port 3000"));

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter);
app.use((err, req, res, next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error'
  return res.status(statusCode).json({
    success : false,
    statusCode,
    message,
  })
});