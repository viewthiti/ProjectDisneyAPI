import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { Vote } from "../model/vote_get_res";

export const router = express.Router();

// vote
router.get("/", (req, res) => {
    const id = req.query.id;
    const sql = "SELECT * FROM Vote";
    conn.query(sql, [id], (err, result) => {
        res.json(result);

    });
});

router.get("/:imgID", (req, res) => {
    let id = req.params.imgID;
    const sql = "SELECT imgID ,sum(score) as total_score FROM Vote where imgID = ?";
    conn.query(sql, [id], (err, result) => {
        res.json(result);

    });
});

//กำหนดรูปภาพที่เข้ามา
router.post("/newimg", (req, res) => {
    const vote: Vote = req.body;
    console.log(req.body);
    if (true) {
        let sql =
            "INSERT INTO `Vote`(`imgID`, `score`, `date`) VALUES (?,?,NOW()) ";
        sql = mysql.format(sql, [
            vote.imgID,
            1000
        ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({
                affected_row: result.affectedRows,
                last_idx: result.insertId
            });
        });
    }
});

// update ranking




//  updateRating คะเเนนโหวต
router.post("/win", (req, res) => {
    const vote: Vote = req.body;
    console.log(req.body);
    if (true) {
        let sql =
            "INSERT INTO `Vote`(`imgID`, `LossWin`, `score`, `date`) VALUES (?,?,?,NOW())";
        sql = mysql.format(sql, [
            vote.imgID,
            "1",
            vote.score,
            vote.data
        ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({
                affected_row: result.affectedRows,
                last_idx: result.insertId
            });
        });
    }
});

router.post("/lose", (req, res) => {
    const vote: Vote = req.body;
    console.log(req.body);

    if (true) {
        let sql =
            "INSERT INTO `Vote`(`imgID`, `LossWin`, `score`, `date`) VALUES (?,?,?,NOW())";
        sql = mysql.format(sql, [
            vote.imgID,
            "0",
            vote.score,
            vote.data
        ]);
        conn.query(sql, (err, result) => {
            if (err) throw err;
            res.status(201).json({
                affected_row: result.affectedRows,
                last_idx: result.insertId
            });
        });
    }
});
