const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!doesExist(username)) {

      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {

      return res.status(409).json({ message: "User already exists!" });
    }
  } else {

    return res.status(400).json({ message: "Unable to register. Username and/or password not provided." });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found for the provided ISBN." });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json({ booksbyauthor: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found by this author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];


  for (const isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json({ booksbytitle: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else if (books[isbn] && !books[isbn].reviews) {
    return res.status(240).json({ message: "No reviews found for this book." });
  }
  else {
    return res.status(404).json({ message: "Book not found for the provided ISBN." });
  }
});

module.exports.general = public_users;
