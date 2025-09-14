const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let general = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({message : "Username and password are required"})
  }
  if(isValid(username)){
    return res.status(409).json({message: "User already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User sucessfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(!book){
    return res.status(404).json({ message : "Book not found"});
  }
  return res.status(200).json(book);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLocaleLowerCase();
  const filteredBooks = Object.entries(books)
  .filter(([_, book]) => book.author.toLocaleLowerCase() === author)
  .map(([isbn, book]) => ({isbn, ...book}));
  if(filteredBooks.length === 0){
    return res.status(404).json({message: "No books found by this author"})
  }
  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLocaleLowerCase();
  const filteredBooks = Object.entries(books)
  .filter(([_, book]) => book.title.toLocaleLowerCase() === title)
  .map(([isbn, book]) => ({isbn, ...book}));
  if(filteredBooks.length === 0){
    return res.json({message: "No books found with this title"})
  }
  return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(!book){
    return res.status(404).json({ message: "Book not found"})
  }
  return res.status(200).json(book.reviews);
});


  // Task 10: Get all books using Promise
  function getBooks() {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("Books not available");
      }
    });
  }
  
  general.get("/", async (req, res) => {
    try {
      const data = await getBooks();
      res.send(JSON.stringify(data, null, 4));
    } catch (err) {
      res.status(500).send({ message: err });
    }
  });

  // Task 11: Get book by ISBN using Promise
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found for ISBN: " + isbn);
      }
    });
  }
  
  general.get("/isbn/:isbn", async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const data = await getBookByISBN(isbn);
      res.send(JSON.stringify(data, null, 4));
    } catch (err) {
      res.status(404).send({ message: err });
    }
  });

  // Task 12: Get books by author using Promise
  function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by author: " + author);
      }
    });
  }
  
  general.get("/author/:author", async (req, res) => {
    try {
      const author = req.params.author;
      const data = await getBooksByAuthor(author);
      res.send(JSON.stringify(data, null, 4));
    } catch (err) {
      res.status(404).send({ message: err });
    }
  });

  // Task 13: Get books by title using Promise
  function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      const matchingBooks = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with title: " + title);
      }
    });
  }
  
  general.get("/title/:title", async (req, res) => {
    try {
      const title = req.params.title;
      const data = await getBooksByTitle(title);
      res.send(JSON.stringify(data, null, 4));
    } catch (err) {
      res.status(404).send({ message: err });
    }
  });
  
  module.exports.general = general;
  module.exports.public_users = public_users;
