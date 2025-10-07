const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let filter_author=  Object.values(books).filter(book=> book.author.toLowerCase() === author.toLowerCase());
  return res.send(filter_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let filter_title=  Object.values(books).filter(book=> book.title.toLowerCase() === title.toLowerCase());
  return res.send(filter_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(!books[isbn]){
    return res.send("ISBN not found");
  }
  let reviews = books[req.params.isbn].reviews;
  if(reviews.length>0){
    return res.send(reviews);   
  }else{
    return res.send("No reviews found for the given ISBN");
  }

});

// Get books with promises
public_users.get('/books',function (req, res) {
  const get_books = new Promise((resolve, reject) => {
      resolve(books);
  });
  get_books.then((books) => {
      return res.send(JSON.stringify(books,null,4));
  });
});

// Get book details based on ISBN with promises
public_users.get('/books/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const get_books = new Promise((resolve, reject) => {
      resolve(books[isbn]);
  });
  get_books.then((books) => {
      return res.send(books);
  }); 

});

// Get book details based on author with promises
public_users.get('/books/author/:author',function (req, res) {
  let author = req.params.author;
  const get_books = new Promise((resolve, reject) => {
      let filter_author=  Object.values(books).filter(book=> book.author.toLowerCase() === author.toLowerCase());
      resolve(filter_author);
  });
  get_books.then((filter_author) => {
      return res.send(filter_author);
  });   
});

// Get all books based on title with promises
public_users.get('/books/title/:title',function (req, res) {
  let title = req.params.title;   
  const get_books = new Promise((resolve, reject) => {  
      let filter_title=  Object.values(books).filter(book=> book.title.toLowerCase() === title.toLowerCase());
      resolve(filter_title);
  });
  get_books.then((filter_title) => {
      return res.send(filter_title);
  });   
});


module.exports.general = public_users;

