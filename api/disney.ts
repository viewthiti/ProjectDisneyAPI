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

// LOGIN GET ยังทำไม่ได้ อิอิ
router.get("/login/eiei", (req, res) => {
  const email = req.query.email;

  const sql = "SELECT email FROM Users WHERE email = ?";

  conn.query(sql, [email], (err, result, fields) => {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
      return;
    }

    if (result.length > 0 ) {
      res.json({ message: "Match found" });
    } else {
      res.json({ message: "No match found" });
    }
  });
});


// LOGIN POST
router.post("/login", (req, res) => {
  const { email } = req.body;
  const {password} = req.body;

  const sql = "SELECT email FROM Users WHERE email = ? AND password = ?";

  conn.query(sql, [email, password], (err, result, fields) => {
    if (err) {
      res.status(500).json({ message: "An error occurred" });
      return;
    }

    if (result.length > 0) {
      const user = result[0];
      res.json({
        message: 'Match found',
        userID: user.id,
        typeID: user.typeID
      });
    } else {
      res.json({ message: 'No match found' });
    }
  });
});



// ADD ข้อมูล ใช้ POST
router.post("/", (req, res) => {
  // Rece data and convert to model
  const disney: Disney = req.body;
  // console.log(disney);
  // console.log(req.body);
  let sql =
    "INSERT INTO `Users`(`username`, `email`, `password`, `typeID`) VALUES (?,?,?,?)";

  sql = mysql.format(sql, [
    disney.username,
    disney.email,
    disney.password,
    1
  ]);

  // Send sql to database
  conn.query(sql, (err, result) => {
    if (err) throw err;
    //return data
    res.status(201).json({
      affected_row: result.affectedRows,
      last_idx: result.insertId
    });
  });
})
