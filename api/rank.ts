import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { Vote } from "../model/vote_get_res";

export const router = express.Router();

// update ranking
router.get("/score", (req, res) => {
    let sql = `SELECT lmage.imgID, lmage.imgName, lmage.url, SUM(Vote.score) AS total_score FROM Vote JOIN lmage ON Vote.imgID = lmage.imgID GROUP BY lmage.imgID ORDER BY total_score DESC LIMIT 10`;
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
    const sql = "SELECT * FROM statistics WHERE imgID = ?";
    conn.query(sql,[imgID],  (err, result) => {
        res.json(result);
    })
});
