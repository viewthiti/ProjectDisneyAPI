import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { Disney } from "../model/disney_get_res";
import mysql from "mysql";


export const router = express.Router();

// get image all
router.get("/image", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM lmage ";
  conn.query(sql, [id], (err, result) => {
    res.json(result);
  });
});

// get img ID
router.get("/", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM lmage WHERE imgID = ?";
  conn.query(sql, [id], (err, result) => {
    res.json(result);
  });
});

//get image.userID = users.userID
router.get("/idm", (req, res) => {
  const id = req.query.id;
  const sql = `SELECT Users.* FROM lmage JOIN Users ON lmage.userID = Users.userID WHERE lmage.imgID = ?`; 
  conn.query(sql, [id], (err, result) => {
    // console.log(result);
    res.json(result);
  });
});

// grt ID
router.get("/main", (req, res) => {
  const id = req.query.id;
  const sql = "SELECT * FROM Users WHERE userID = ?";
  conn.query(sql, [id], (err, result) => {
    res.json(result);
  });
});


// update profile
router.put("/:id", async (req, res) => {
  // รับข้อมูล
  let id = +req.params.id;
  let user: Disney = req.body;

  // get ช้อมูลเดิมด้วย id
  let sql = "select * from Users where userID = ?;";
  sql = mysql.format(sql, [id]);

  //Query เอาข้อมูลเดิม
  let result = await queryAsync(sql);
  const jsonStr = JSON.stringify(result);
  const jsonObj = JSON.parse(jsonStr);
  let userOriginal: Disney = jsonObj[0];
  //Merge new data
  const updateUser = { ...userOriginal, ...user }
  //update
  // Pre SQL
  sql =
    "update  `Users` set `username`=?, `email`=?, `password`=?, `imgUser`=? where `userID`=?";
  sql = mysql.format(sql, [
    updateUser.username,
    updateUser.email,
    updateUser.password,
    updateUser.imgUser,
    id,
  ]);
  //   send SQL
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});


//เอารูปของมาโชว์
router.get("/show", (req, res) => {
  const id = req.query.userID;
  const sql = `SELECT Users.username, Users.email, lmage.url, lmage.imgID FROM Users JOIN lmage ON lmage.userID = Users.userID WHERE Users.userID = ?`;
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
  });
});




