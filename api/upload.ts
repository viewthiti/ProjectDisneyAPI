import express from "express";
import multer from "multer";
import mysql from "mysql";

export const router = express.Router();

router.get("/", (req, res) => {
  res.send("Method GET in uplaod.ts");
});

// Save
// 1.connect filebase
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { conn } from "../dbconnect";
import { lmage } from "../model/Image_get_res";
const firebaseConfig = {
  apiKey: "AIzaSyBhNh6ePMdLP8stD-WPerMxjGzRAgUFZWE",
  authDomain: "projectdisney-app.firebaseapp.com",
  projectId: "projectdisney-app",
  storageBucket: "projectdisney-app.appspot.com",
  messagingSenderId: "530345676487",
  appId: "1:530345676487:web:46a3e8131cd4471dd0f8e2",
  measurementId: "G-2CQBQ7L2JG",
};

//เชื่อม firebase
initializeApp(firebaseConfig);
const storage = getStorage();

class FileMiddleware {
  //Attribute filename
  filename = "";

  //Attribute diskLoader
  //Create object of diskLoader for saving file
  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    //limits file size
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

//POST/Upload
const fileUpload = new FileMiddleware();
router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {
  // 2.uplaod file to firebase
  //Genarate filename
  const filename =
    Date.now() + "-" + Math.round(Math.random() * 10000) + ".png";

  //define saving filename On firebase
  const storageRef = ref(storage, "/images/" + filename);
  //defind detail
  const metadata = {
    contentType: req.file!.mimetype,
  };
  //upload
  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file!.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);
  res.status(200).json({
    url: url,
  });

});

// ADD ข้อมูล ใช้ POST
router.post("/img/", (req, res) => {
  const img: lmage = req.body;
  let sql =
    "INSERT INTO `lmage`(`userID`, `url`, `uploadDay`) VALUES (?, ?, NOW())";
  sql = mysql.format(sql, [
    img.userID, 
    img.url,
    img.uploadDay
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
});

// delete
router.delete("/:id", (req, res) => {
  const imgID = req.params.id;
  
  let sql = "SELECT url FROM lmage WHERE imgID = ?";
  sql = mysql.format(sql, [
    imgID
  ]);
  conn.query(sql, async (err, result)=>{
      if (err) {
          res.status(400).json(err);
      }
      const imagePath = result[0].ImageURL; // Assuming ImageURL contains the filename
      sql = "DELETE FROM Posts WHERE imgID = ?";
      // Construct the storage reference using the correct path
      const storageRef = ref(storage, imagePath);
      
      try {
          await deleteObject(storageRef);
          console.log('Image deleted successfully');
      } catch (error) {
          res.status(501).json({ error: 'Error deleting image from storage' });
          return;
      }
      
      conn.query(sql, [imgID], (err, result) => {
          if (err) throw err;
          res.status(201).json({
              affected_row: result.affectedRows
          });
      });
  });
});





