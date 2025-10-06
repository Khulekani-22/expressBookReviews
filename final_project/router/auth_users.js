const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
   return (username in users);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
   if(isValid(username)){
     if(users[username] === password){
       return true;
     }else{
       return false;
     }
   }else{
      return false;
   }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
     res.status(400).json({message : `Please input the username and the password`});
  }

  if(!authenticatedUser(username,password)){
    res.status(401).json({message : `Username and password not match`})
  }else{

      let accesstoken = jwt.sign({data : username} , 'access', {expiresIn : 60 * 60})
      req.session.authorization = {
        accesstoken,
        username
      }
      return res.status(200).json(
        {
          message : `User ${username} has login `,
          token: accesstoken
        }
      )
    
  }
  

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session || !req.session.authorization || !req.session.authorization.username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    let isbn = req.params.isbn;
    let username = req.session.authorization.username;
    let review = req.body.review;

    if (!review || review.trim().length === 0) {
        return res.status(400).json({ message: "Review text is required" });
    }

    let book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: book.reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
