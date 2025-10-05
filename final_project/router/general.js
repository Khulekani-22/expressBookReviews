const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if(books){
    return res.status(200).send(JSON.stringify(books));
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book_find = books[isbn];
  if(book_find){
    return res.status(200).json({book_find})
  }else{
    return res.status(200).json({message : `Book of isbn" ${isbn} not found`})
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book_find_with_author = {};
  for(let isbn in books){
    if(books[isbn].author === author){
      book_find_with_author[isbn] = books[isbn]
    }
  }

  return res.status(200).json(book_find_with_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book_find_with_title = {};
  for(let isbn in books){
    if(books[isbn].title === title){
      book_find_with_title[isbn] = books[isbn]
    }
  }
  return res.status(200).json(book_find_with_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
