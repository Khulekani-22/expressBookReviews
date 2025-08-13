const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  if (typeof username !== 'string' || username.trim() === '') {
    return false;
  }
  return true;
}



const authenticatedUser = (username, password) => { //returns boolean
  let matchingUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return matchingUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in: Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });


    req.session.authorization = {
      accessToken: accessToken,
      username: username
    }
    return res.status(200).json({ message: "User successfully logged in", accessToken: accessToken });
  } else {

    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;


  const username = req.session.authorization ? req.session.authorization.username : null;


  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }


  if (books[isbn]) {

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: `Review for ISBN ${isbn} by user ${username} added/updated successfully.` });
  } else {

    return res.status(404).json({ message: "Book not found." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const username = req.session.authorization ? req.session.authorization.username : null;


  if (!username) {
    return res.status(401).json({ message: "Unauthorized: User not logged in." });
  }


  if (books[isbn]) {

    if (books[isbn].reviews && books[isbn].reviews[username]) {

      delete books[isbn].reviews[username];
      return res.status(200).json({ message: `Review by user ${username} for ISBN ${isbn} deleted successfully.` });
    } else {

      return res.status(404).json({ message: `No review found by user ${username} for ISBN ${isbn}.` });
    }
  } else {

    return res.status(404).json({ message: "Book not found for the provided ISBN." });
  }
});


regd_users.get("/auth/", async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books asynchronously:", error.message);
    return res.status(500).json({ message: "Error retrieving books asynchronously. Please try again later." });
  }
});

regd_users.get("/auth/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://127.0.0.1:5000/${encodeURIComponent(isbn)}');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books asynchronously:", error.message);
    return res.status(500).json({ message: "Error retrieving books asynchronously. Please try again later." });
  }
});

regd_users.get("/auth/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get('http://127.0.0.1:5000/${encodeURIComponent(author)}');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books asynchronously:", error.message);
    return res.status(500).json({ message: "Error retrieving books asynchronously. Please try again later." });
  }
});

regd_users.get("/auth/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get('http://127.0.0.1:5000/${encodeURIComponent(title)}');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books asynchronously:", error.message);
    return res.status(500).json({ message: "Error retrieving books asynchronously. Please try again later." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
