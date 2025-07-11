//Imported the needed modules
import dotenv from "dotenv";//to save code in env file
dotenv.config();//configure it

import express from "express";
import bodyParser from "body-parser";
import pg from  "pg";

//entry point to initialise the express app
const app = express();
const port = 3000;

//set up and connect to postgres database
const db = new pg.Client({
    /*user: "postgres",
    host: "localhost",
    database: "project",
    password: "",
    port: 5432*/
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

//Middleware set upto recieve form data submitted via POST
app.use(bodyParser.urlencoded({ extended: true}));
//to access static files such as css in the public folder
app.use(express.static("public"));

// Temporary hardcoded book list (not used after DB loads)
let books_read = [
    {id: 1, title: "Treasure Island", author: "Jamie Bond", date_read: "7/7/25",
    cover_url: "amzn.com", rating: "5", review: "Full of suspense", 
    created_at: "7/7/25"},
    {id: 2, title: "Hamlet", author: "William S", date_read: "7/7/25",
        cover_url: "amzn.com", rating: "5", review: "Full of suspense", 
        created_at: "7/7/25"}
];

//  GET "/" — Load homepage with book data from data base
app.get("/", async (req, res) => {
    try{
        const result = await db.query("SELECT * FROM books_read ORDER BY date_read DESC");
        books_read = result.rows;
        res.render("index.ejs", {books_read});
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST "/add" — Add a new book to the database
app.post("/add", async (req, res) => {
   const { title, author, cover_url, rating, review, date_read } = req.body;
   try{
    await db.query("INSERT INTO books_read (title, author, cover_url, rating, review, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, author, cover_url, rating, review, date_read]);
    res.redirect("/");
   } catch (err) {
    console.log(err);
   }
});

// POST "/edit" — Update a book's details in the database
app.post("/edit", async (req, res) => {
    const { id, title, author, cover_url, rating, review, date_read} = req.body;
    //const ratingValue = rating === "" ? null : parseInt(rating);
    try{
        await db.query("UPDATE books_read SET title=$1, author=$2, cover_url=$3, rating=$4, review=$5, date_read=$6 WHERE id=$7",
            [title, author, cover_url, rating, review, date_read, id]
        );
        res.redirect("/?updated=true");
    } catch (err) {
        console.log(err);
    }
});

// POST "/delete" — Delete a book by ID
app.post("/delete", async (req, res) => {
    try {
        await db.query("DELETE FROM books_read WHERE id = $1", [req.body.id]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

});

//Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });