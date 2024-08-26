const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

app.listen(3000);
