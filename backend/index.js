import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Routes from "./Routes/User/index.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", Routes);

// ✅ Export handler instead of listening
connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("Mongo Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
  // add port here
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default app;
