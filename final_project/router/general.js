const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "User name and password are required",
        });
    }

    const isExist = users.find((user) => user.username === username);
    if (isExist) {
        return res.status(400).json({
            message: "This user already exists",
        });
    }
    users.push({
        username,
        password,
    });
    return res.status(201).json({
        message: "User was successfully registered :)",
        username: username,
    });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    try {
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });

        return res.status(200).json({
            message: "Booklist loaded",
            books: response.data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error loading",
            error: error.message,
        });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = parseInt(req.params.isbn);
        if (isNaN(isbn)) {
            return res.status(400).json({
                message: "Enter ISBN number",
            });
        }

        const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: books[isbn],
                });
            }, 100);
        });

        return res.status(200).json({
            message: "Book with this ISBN",
            book: response.data,
        });
    } catch (err) {
        return res.status(400).json({
            message: "Error accessing the book with ISBN",
            error: err.message,
        });
    }
});
  
// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
        const autor = req.params.author.toLowerCase();
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });
        const buchlist = response.data;

        const result = Object.values(buchlist).filter(
            (book) => book.author.toLowerCase() === autor
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: "No data for these users",
            });
        }

        return res.status(200).json({
            message: "book data author",
            books: result,
        });
    } catch (err) {
        return res.json({
            message: "Error loading books",
            error: err.message,
        });
    }
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });
        const bookList = Object.values(response.data);
        const book = bookList.filter((b) => b.title.toLowerCase() === title);
        if (book.length === 0) {
            return res.status(404).json({
                message: "not found",
            });
        }

        return res.status(200).json({
            message: "Books",
            books: book,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error loading book details",
            error: error.message,
        });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "book not found",
        });
    }

    const reviewKeys = Object.keys(book.reviews);
    if (reviewKeys.length === 0) {
        return res.json({
            message: "this book has no rating",
        });
    }
    return res.json({
        message: "Evaluation",
        reviews: book.reviews,
    });
});

module.exports.general = public_users;
