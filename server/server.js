import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/prompt.route.js";
import dotenv from "dotenv";

dotenv.config();

const mongouri = process.env.MONGODB_URI;

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());

app.use("/api", router);

mongoose.Promise = global.Promise;

mongoose
  .connect(mongouri, {
    useNewUrlParser: true,
    dbName: "share_prompt",
  })
  .then(() => {
    console.log("Databse Connected Successfully!!");
    app.listen(8000, function () {
      console.log("server at port 8000");
    });
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

app.get("/", (req, res) => res.json({ message: req.user }));
