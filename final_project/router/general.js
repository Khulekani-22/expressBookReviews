const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulate async access to books
const getBooksAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 100); // Simulate delay
  });
};

// ✅ Task 1: Get all books using async/await
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getBooksAsync();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books." });
  }
});

// ✅ Task 2: Get book by ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn.trim();

  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found for the given ISBN.");
    }
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// ✅ Task 3: Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  const authorName = req.params.author.toLowerCase();

  try {
    const allBooks = await getBooksAsync();
    const matchingBooks = Object.entries(allBooks)
      .filter(([_, book]) => book.author.toLowerCase().includes(authorName))
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      throw new Error("No books found for the given author.");
    }
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// ✅ Task 4: Get books by title using Promises
public_users.get('/title/:title', (req, res) => {
  const titleQuery = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const matchingBooks = Object.entries(books)
      .filter(([_, book]) => book.title.toLowerCase().includes(titleQuery))
      .map(([isbn, book]) => ({ isbn, ...book }));

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with the given title.");
    }
  })
    .then(results => res.status(200).json(results))
    .catch(err => res.status(404).json({ message: err }));
});

// Book reviews (unchanged)
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn.trim();
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

// Register new user (unchanged)
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: "Username and password are required and must be strings." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose another." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

module.exports.general = public_users;
