import express from "express";
import { router as disney } from "./api/disney";
import { router as profile } from "./api/profile";
import { router as upload } from "./api/upload";
import { router as vote } from "./api/vote";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();
// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
app.use(
  cors({
    origin: "*",
    // origin: "http://localhost:4200",
  })
);


app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/disney", disney);
app.use("/profile", profile);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
app.use("/vote", vote);



// app.use("/Users", )


