const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
    let username = req.body.username;  
    let password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    let existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Store new user
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});



// ===== Promise callbacks =====
function getBookListWithPromises() {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log("Books available in the shop (Promise):");
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error fetching book list (Promise):", error.message);
    });
}

// ===== Async/Await =====
async function getBookListAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Books available in the shop (Async/Await):");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching book list (Async/Await):", error.message);
  }
}

// Call both
getBookListWithPromises();
getBookListAsync();












public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from URL
    const book = books[isbn];     // Look up the book by ISBN

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // Pretty JSON
    } else {
        res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});




// ------------------- Task 11: Promise callbacks -------------------
function getBookByISBNAxiosPromise(isbn) {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book details for ISBN ${isbn} (Promise):`);
            console.log(response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details for ISBN ${isbn} (Promise):`, error.message);
        });
}

// ------------------- Task 11: Async/Await -------------------
async function getBookByISBNAxiosAsync(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Book details for ISBN ${isbn} (Async/Await):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error fetching book details for ISBN ${isbn} (Async/Await):`, error.message);
    }
}

// Call the functions (example ISBN = 1)
getBookByISBNAxiosPromise(2);
getBookByISBNAxiosAsync(2);






  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Get the author name from URL
    const bookKeys = Object.keys(books); // Get all book ISBN keys
    let matchingBooks = [];

    // Iterate through books to find matches
    bookKeys.forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    });

    // Return results
    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Pretty print
    } else {
        res.status(404).json({ message: `No books found by author '${author}'` });
    }
});


// ------------------- Task 12: Promise callbacks -------------------
function getBookByAuthorAxiosPromise(author) {
    axios.get(`http://localhost:5000/author/${author}`)
        .then(response => {
            console.log(`Book details of ${author} (Promise):`);
            console.log(response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details of author ${author} (Promise):`, error.message);
        });
}

// ------------------- Task 12: Async/Await -------------------
async function getBookByAuthorAxiosAsync(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Book details of author ${author} (Async/Await):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error fetching book details of author ${author} (Async/Await):`, error.message);
    }
}

getBookByAuthorAxiosPromise("Chinua Achebe");
getBookByAuthorAxiosAsync("Chinua Achebe");







// Get all books based on title
public_users.get('/title/:title',function (req, res) {
const title = req.params.title; // Get the title from URL
    const bookKeys = Object.keys(books); // Get all book ISBN keys
    let matchingBooks = [];

    // Iterate through books to find matches
    bookKeys.forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(books[isbn]);
        }
    });

    // Return results
    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Pretty print
    } else {
        res.status(404).json({ message: `No books found from this title '${title}'` });
    }
});



// ------------------- Task 13: Promise callbacks -------------------
function getBookByTitleAxiosPromise(title) {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Book details for ${title} (Promise):`);
            console.log(response.data);
        })
        .catch(error => {
            console.error(`Error fetching book details for the title${title} (Promise):`, error.message);
        });
}

// ------------------- Task 13: Async/Await -------------------
async function getBookByTitleAxiosAsync(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Book details for the title ${title} (Async/Await):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Error fetching book details for the title ${title} (Async/Await):`, error.message);
    }
}

getBookByTitleAxiosPromise("Fairy tales");
getBookByTitleAxiosAsync("Fairy tales");





// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Get ISBN from URL

    // Check if the book exists
    if (books[isbn]) {
        // Send only the reviews object
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        // Book not found
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});


module.exports.general = public_users;
