import express from "express";
import { router as disney } from "./api/disney";
import { router as profile } from "./api/disney";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();
// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
app.use(
  cors({
    origin: "*",
  })
);


app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/disney", disney);
app.use("/profile", profile);

// app.use("/Users", )


