import express from "express";
import { router as disney } from "./api/disney";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();
// app.use("/", (req, res) => {
//   res.send("Hello World!!!");
// });
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);


app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/disney", disney);
// app.use("/Users", )


