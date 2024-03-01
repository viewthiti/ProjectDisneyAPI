import express from "express";
import { conn } from "../dbconnect";
import { Disney } from "../model/disney_get_res";
import mysql from "mysql";


export const router = express.Router();

router.get("/", (req, res) => {
  conn.query('select * from Users', (err, result, fields) => {
    res.json(result);
  });
});