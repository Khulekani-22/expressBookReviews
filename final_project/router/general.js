const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

// Görev 1 ve 10: Tüm kitaplar
public_users.get('/', async (req, res) => {
  try {
    let allBooks = await new Promise((resolve, reject) => books ? resolve(books) : reject("Kitap bulunamadı"));
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// Görev 2 ve 11: ISBN'e göre
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    let book = await new Promise((resolve, reject) => books[isbn] ? resolve(books[isbn]) : reject("Kitap bulunamadı"));
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Görev 3 ve 12: Yazar
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    let booksByAuthor = await new Promise((resolve, reject) => {
      let filtered = Object.values(books).filter(b => b.author.toLowerCase() === author);
      filtered.length > 0 ? resolve(filtered) : reject("Bu yazarın kitabı bulunamadı");
    });
    return res.status(200).json(booksByAuthor);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Görev 4 ve 13: Başlık
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    let booksByTitle = await new Promise((resolve, reject) => {
      let filtered = Object.values(books).filter(b => b.title.toLowerCase() === title);
      filtered.length > 0 ? resolve(filtered) : reject("Bu başlığa sahip kitap bulunamadı");
    });
    return res.status(200).json(booksByTitle);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Görev 5: ISBN’e göre yorumlar
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    let reviews = await new Promise((resolve, reject) => books[isbn] ? resolve(books[isbn].reviews) : reject("Kitap bulunamadı"));
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

module.exports.general = public_users;
