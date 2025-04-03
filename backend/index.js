import express, { json } from "express";
import { connect } from "mongoose";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import Routes from "./Routes/User/index.js";
dotenv.config();

const corsOptions = {
  origin: "*", 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use("/", Routes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});

connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("Mongo Connected Successfully");
    console.log("mongo db string: " + process.env.MONGODB_STRING
    );
  })
  .catch((err) => {
    console.log(err);
  });