const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
return users.some(
        (user) => user.username === username && user.password === password
    );
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(409).json({
            message: "Please enter username and password both!",
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(400).json({
            message: "Username and password do not match",
            username,
            password,
        });
    }

    const token = jwt.sign({ username }, "fingerprint", { expiresIn: "1h" });

    req.session.authorization = {
        accessToken: token,
        username,
    };

    return res.status(200).json({
        message: "Login successful",
        token: token,
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    const username = req.session.authorization?.username;
    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Rating saved",
        reviews: book.reviews,
        books
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // keep as string
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({
            message: "Not authorized. Please log in",
        });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "Book not found",
        });
    }

    if (!book.reviews[username]) {
        return res.status(404).json({
            message: "No review found from this user",
        });
    }

    delete book.reviews[username];  // delete user’s review

    return res.status(200).json({
        message: "Review successfully deleted",
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
