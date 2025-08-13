const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ 
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists and password matches
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
        { username: user.username },   // payload
        "access",                      // secret key
        { expiresIn: "1h" }             // token expiry
    );

    // Save token in session
    req.session.authorization = {
        accessToken: accessToken
    };

    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;                       // Get ISBN from URL
    const review = req.query.review;                    // Get review from query string
    const username = req.session.authorization.username; // Username from session

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    // Add or update the review for this user
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for book with ISBN ${isbn} added/updated successfully`,
        reviews: books[isbn].reviews
    });
});
  

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // logged-in user

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }

    // Check if the review by this user exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "No review found for this user to delete" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: `Review by ${username} for book with ISBN ${isbn} deleted successfully`,
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
