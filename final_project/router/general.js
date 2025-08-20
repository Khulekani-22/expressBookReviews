const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username already exists
  if (!isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  
  // Register new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];
  
  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });
  
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];
  
  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  });
  
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the book list available in the shop using async-await
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100); // Simulate async operation
  });
};

public_users.get('/async', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(JSON.stringify(allBooks, null, 2));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book details based on ISBN using async-await
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    }, 100); // Simulate async operation
  });
};

public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 12: Get book details based on author using async-await
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const booksByAuthor = [];
      
      bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      });
      
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 100); // Simulate async operation
  });
};

public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Task 13: Get book details based on title using async-await
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const booksByTitle = [];
      
      bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      });
      
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 100); // Simulate async operation
  });
};

public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
