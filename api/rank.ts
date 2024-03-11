import express from "express";
import { conn, queryAsync } from "../dbconnect";
import mysql from "mysql";
import { Vote } from "../model/vote_get_res";

export const router = express.Router();

router.get("/yesterday", (req, res) => {
    const sql = "SELECT statistics.* FROM statistics WHERE DATE(statistics.date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) ORDER BY statistics.score DESC LIMIT 10";
    conn.query(sql, (err, result) => {
        res.json(result);
    });
});

router.get("/today", (req, res) => {
    const sql = "SELECT statistics.* FROM statistics WHERE DATE(statistics.date) = CURDATE() ORDER BY statistics.score DESC LIMIT 10";
    conn.query(sql, (err, result) => {
        res.json(result);
    });
});