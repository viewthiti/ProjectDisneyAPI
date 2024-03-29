import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { Vote } from "../model/vote_get_res";

export const router = express.Router();

// update ranking
router.get("/score", (req, res) => {
    let sql = `SELECT lmage.imgID, lmage.imgName, lmage.url, SUM(Vote.score) AS total_score 
    FROM Vote JOIN lmage ON Vote.imgID = lmage.imgID 
    GROUP BY lmage.imgID 
    ORDER BY total_score DESC LIMIT 10`;
    conn.query(sql, (err, result) => {
        if (err) {
            console.error("Error retrieving data:", err);
            res.status(500).send("Error retrieving data");
            return;
        }
        res.json(result);
    });
    
});

router.get("/scoreAll/:imgID", (req, res) => {
    const imgID = req.params.imgID;
    let sql = `SELECT lmage.imgID, lmage.imgName, lmage.url, SUM(Vote.score) AS total_score 
    FROM Vote 
    JOIN lmage ON Vote.imgID = lmage.imgID 
    WHERE lmage.imgID = ?
    GROUP BY lmage.imgID 
    ORDER BY total_score DESC;`;
    conn.query(sql, [imgID], (err, result) => {
        if (err) {
            console.error("Error retrieving data:", err);
            res.status(500).send("Error retrieving data");
            return;
        }
        res.json(result);
    });
});


router.get("/today/:imgID", (req, res) => {
    const imgID = req.params.imgID;
    const sql = "SELECT statistics.* FROM statistics WHERE DATE(statistics.date) = CURDATE() AND imgID = ? ORDER BY statistics.rank DESC LIMIT 1;";
    conn.query(sql, [imgID], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json(result);
    });
});


router.get("/yesterday/:id", (req, res) => {
    const imgID = req.params.id;
    const sql = "SELECT statistics.* FROM statistics WHERE imgID = ? Order By sid DESC LIMIT 1";
    conn.query(sql,[imgID],  (err, result) => {
        res.json(result);
    })
});

router.get("/graph/:id", (req, res) =>{
    const imgID = req.params.id;
    const sql = `SELECT *, DATE_FORMAT(date, '%d-%m-%Y') AS format_date
    FROM statistics
    WHERE imgID = ? AND date <= CURDATE() AND date >= CURDATE() - INTERVAL 6 DAY
    ORDER BY sid`;
    conn.query(sql,[imgID],  (err, result) => {
        res.json(result);
    })
});

router.get("/rankAll", (req, res) => {
    let sql = `SELECT imgID, SUM(score) AS total_score FROM Vote GROUP BY imgID`;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send("Error retrieving data");
            return;
        }
        result.sort((a: { total_score: number; }, b: { total_score: number; }) => b.total_score - a.total_score);
        for (let i = 0; i < result.length; i++) {
            result[i].rank = i + 1;
        }
        res.json(result);
    });
});
