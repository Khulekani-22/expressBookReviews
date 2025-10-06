const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message: "Please enter the username and the password!"});
  }
  

  if(username in users){
    return res.status(409).json({message: `User ${username} has already been registered`});
  }
  

  users[username] = password;
  return res.status(201).json({message: `New User ${username} has been registered`});

});

// Get the book list available in the shop


public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ message: err }));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  new Promise((resolve,reject) => {
      let isbn = req.params.isbn;
      let book_find = books[isbn];
      if(book_find){
        resolve(book_find);
      }else{
        reject("Book not found");
      }

  })
  .then(data => res.status(200).json(data))
  .catch(err => res.status(500).json({message : err}));

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve,reject) =>{
     let author = req.params.author;
      let book_find_with_author = {};
      for(let isbn in books){
        if(books[isbn].author === author){
          book_find_with_author[isbn] = books[isbn]
        }
      }

      if(book_find_with_author){
        resolve(book_find_with_author);
      }else{
        reject("No Book Found");
      }

    
  }).then(data => res.status(200).json(data))
  .catch(err => res.status(500).json({message : err}))

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  new Promise((resolve,reject)=>{
      let title = req.params.title;
      let book_find_with_title = {};
      for(let isbn in books){
        if(books[isbn].title === title){
          book_find_with_title[isbn] = books[isbn]
        }
      }
      if(book_find_with_title){
        resolve(book_find_with_title)
      }else{
        reject("No book found with your title")
      }

  }).then(data=>res.status(200).json(data))
  .catch(err=> res.status(500).json({message : err}))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book_find = books[isbn];
  if(book_find){
    return res.status(200).json(books[isbn].reviews)
  }
  return res.status(300).json({message: "Yet to be implemented"});
});



module.exports.general = public_users;
