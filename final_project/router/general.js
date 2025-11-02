const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop (async via axios)
public_users.get('/',async function (req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Direct book list endpoint consumed by the axios call above
public_users.get('/books',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN (async via axios)
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/isbn/${req.params.isbn}/raw`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Helper endpoint consumed by the axios call above
public_users.get('/isbn/:isbn/raw', function (req, res) {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});
  
// Get book details based on author (async via axios)
public_users.get('/author/:author', async function (req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/author/${encodeURIComponent(req.params.author)}/raw`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found for the given author" });
    }
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Helper endpoint consumed by the axios call above
public_users.get('/author/:author/raw', function (req, res) {
  const { author } = req.params;
  const matchingBooks = Object.keys(books)
    .map((isbn) => ({ isbn, ...books[isbn] }))
    .filter((book) => book.author.toLowerCase() === author.toLowerCase());

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found for the given author" });
  }

  return res.status(200).json(matchingBooks);
});

// Get all books based on title (async via axios)
public_users.get('/title/:title', async function (req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = await axios.get(`${baseUrl}/title/${encodeURIComponent(req.params.title)}/raw`);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "No books found with the given title" });
    }
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Helper endpoint consumed by the axios call above
public_users.get('/title/:title/raw', function (req, res) {
  const { title } = req.params;
  const matchingBooks = Object.keys(books)
    .map((isbn) => ({ isbn, ...books[isbn] }))
    .filter((book) => book.title.toLowerCase() === title.toLowerCase());

  if (matchingBooks.length === 0) {
    return res.status(404).json({ message: "No books found with the given title" });
  }

  return res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
