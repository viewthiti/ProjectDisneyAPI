import express from "express";
import { conn } from "../dbconnect";
import { Disney } from "../model/disney_get_res";
import mysql from "mysql";


export const router = express.Router();

// get image all
router.get("/image", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM lmage " ;
  conn.query(sql, [id], (err, result) => {
      res.json(result);
  });
});

// get img ID
router.get("/", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM lmage WHERE imgID = ?" ;
  conn.query(sql, [id], (err, result) => {
      res.json(result);
  });
});

//get image.userID = users.userID
router.get("/idm", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT Users.* FROM lmage JOIN Users ON lmage.userID = Users.userID WHERE lmage.imgID = ?";
  conn.query(sql, [id], (err, result) => {
      res.json(result);
  });
});

// grt ID
router.get("/main", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM Users WHERE userID = ?" ;
  conn.query(sql, [id], (err, result) => {
      res.json(result);
  });
});



