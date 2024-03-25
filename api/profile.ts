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


router.get("/showall", (req, res) => {
  const id = req.query.userID;
  const sql = `SELECT username, email, imgUser,typeID FROM Users  WHERE userID = ?`;
  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(result);
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


// เเก้ไขชื่อ
router.put("/:userID", async (req, res) => {
  // Receive data 
  const id = +req.params.userID;
  const profile: Disney = req.body;

  //GET original data from table by id
  let sql = "select * from Users where userID = ?";
  sql = mysql.format(sql, [id]);

  //Query and Wait for result 
  const result = await queryAsync(sql);
  const jsonStr = JSON.stringify(result);
  const jsonObj = JSON.parse(jsonStr);
  const disneyOriginal: Disney = jsonObj[0];

  const updateprofile = { ...disneyOriginal, ...profile };
  sql =
      "update  `Users` set `username`=?, `email`=?, `password`=? where `userID`=?";

  sql = mysql.format(sql, [
    updateprofile.username,
    updateprofile.email,
    updateprofile.password,
    id
  ]);
  conn.query(sql, (err, result) => {
      if (err) throw err;
      res.status(200).json({
          affected_row: result.affectedRows
      });
  });
});





