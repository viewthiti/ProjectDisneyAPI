import express from "express";
import { conn, queryAsync } from "../dbconnect";
import { lmage } from "../model/Image_get_res";
import mysql from "mysql";

export const router = express.Router();

//show image
router.get("/:imgID", (req, res) => {
  let id = req.params.imgID;
  const sql = `SELECT lmage.imgID, lmage.imgName, lmage.url, lmage.uploadDay, SUM(Vote.score) AS total_score
    FROM Vote
    JOIN lmage ON Vote.imgID = lmage.imgID
    WHERE lmage.imgID = ${id}
    GROUP BY lmage.imgID, lmage.imgName, lmage.url`;
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(result);
  });
});

// เเก้ไขชื่อ
router.put("/:imgID", async (req, res) => {
  // Receive data
  const id = +req.params.imgID;
  const profile: lmage = req.body;

  //GET original data from table by id
  let sql = "select * from lmage where imgID = ?";
  sql = mysql.format(sql, [id]);

  //Query and Wait for result
  const result = await queryAsync(sql);
  const jsonStr = JSON.stringify(result);
  const jsonObj = JSON.parse(jsonStr);
  const lmageOriginal: lmage = jsonObj[0];

  const updatelmage = { ...lmageOriginal, ...profile };
  sql = "update  `lmage` set `imgName`=? where `imgID`=?";

  sql = mysql.format(sql, [updatelmage.imgName, id]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      affected_row: result.affectedRows,
    });
  });
});

//ลบคะแนน vote เก่าของ id นั้นๆ
router.delete("/:imgID", (req, res) => {
    const imgID = req.params.imgID;
    let sql =  "DELETE FROM Vote WHERE imgID = ? AND score != 1000";
    sql = mysql.format(sql, [
      imgID
    ]);
  conn.query(sql, [imgID], (err, result) => {
    if (err) throw err;
    res.status(200).json({
      affected_row: result.affectedRows,
    });
  });
});

//ลบสถิติรายวันเก่าๆ เก่าของ id นั้นๆ
router.delete("/stat/:imgID", (req, res) => {
  const imgID = req.params.imgID;
  let sql =  "DELETE FROM `statistics` WHERE imgID = ?";
  sql = mysql.format(sql, [
    imgID
  ]);
conn.query(sql, [imgID], (err, result) => {
  if (err) throw err;
  res.status(200).json({
    affected_row: result.affectedRows,
  });
});
});

//change profile
router.put("/img/change", (req, res) => {
    const img: lmage = req.body;
    let sql = "UPDATE `lmage` SET `url` = ?,`imgName` = NULL,`uploadDay` = NOW() WHERE `imgID` = ?";
    sql = mysql.format(sql, [img.url, img.imgID]);
  
    // Send sql to database
    conn.query(sql, (err, result) => {
      if (err) {
        console.error("Error executing SQL:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      //return data
      res.status(200).json({
        affected_row: result.affectedRows,
        message: "Profile image updated successfully"
      });
    });
  });
  