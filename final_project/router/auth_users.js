const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.find(user => user.username === username) === undefined;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if user exists and password is correct
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });
    
    // Save token in session
    req.session.authorization = {
      accessToken, username
    };
    
    return res.status(200).json({message: "User successfully logged in", token: accessToken});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization['username'];
  
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  if (books[isbn]) {
    // Add or modify the review for this user
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added/modified successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  
  if (books[isbn]) {
    // Check if the user has a review for this book
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found for this user"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
