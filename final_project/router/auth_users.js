const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Kullanıcı adı geçerliliği
const isValid = (username) => {
  return users.filter(user => user.username === username).length === 0;
};

// Kullanıcı doğrulama
const authenticatedUser = (username, password) => {
  return users.filter(user => user.username === username && user.password === password).length > 0;
};

// Görev 6: Yeni kullanıcı kaydı
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli." });
  if (!isValid(username)) return res.status(409).json({ message: "Bu kullanıcı adı zaten mevcut." });

  users.push({ username, password });
  return res.status(200).json({ message: "Kayıt başarılı." });
});

// Görev 7: Giriş işlemi
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli." });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Giriş başarılı.", token: accessToken });
  } else {
    return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre." });
  }
});

// Görev 8: Yorum ekle/güncelle
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "Önce giriş yapmalısınız." });
  if (!books[isbn]) return res.status(404).json({ message: "Kitap bulunamadı." });

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Yorum eklendi/güncellendi.", reviews: books[isbn].reviews });
});

// Görev 9: Yorum sil
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "Önce giriş yapmalısınız." });
  if (!books[isbn]) return res.status(404).json({ message: "Kitap bulunamadı." });

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Yorum silindi.", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Bu kullanıcıya ait yorum bulunamadı." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
