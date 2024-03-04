import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";

//cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});
require("dotenv").config();

//Create the server
const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${port}`);
  connectDB();
});
