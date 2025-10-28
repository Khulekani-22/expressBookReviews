import express from "express";
import axios from "axios";
import users from "../model/user.js";
import all_books from "../model/books.js";
import jwt from "jsonwebtoken";
import { auth_users } from "./auth_users.js";

const public_users = express.Router();

public_users.post("/register", async function (req, res) {
  const { username, password, email, number } = req.body;

  if (username && password && email && number) {
    const find_user = await users.findOne({
      where: {
        email: email,
      },
    });

    if (find_user === null) {
      await users.create({
        full_name: username,
        password: password,
        email: email,
        number: number,
      });

      return res.status(200).json({
        data: req.body,
      });
    }

    return res.status(404).json("there is already an account by this email");
  } else {
    return res.status(404).send("type all the infos !");
  }
});

// this function gives you all the books

public_users.get("/", async function (req, res) {
  try {
    const books = await all_books.findAll();
    return res.status(200).send(books);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching books" });
  }
});

// Get book details based on ISBN_ID

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbnID = req.params.isbn;
  try {
    const find_book = await all_books.findOne({
      where: {
        book_id: isbnID,
      },
    });

    if (!find_book) throw new Error("there is no book by this id");

    return res.status(200).send(find_book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

// Get book details based on author

public_users.get("/author/:author", async (req, res) => {
  try {
    const { author } = req.params;

    try {
      const find_book = await all_books.findOne({
        where: {
          author: author,
        },
      });

      if (!find_book)
        throw new Error("there is no book written by this author !");

      return res.status(200).send(find_book);
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on title

public_users.get("/title/:title", async (req, res) => {
  try {
    const { title } = req.params;

    const find_book = await all_books.findOne({
      where: {
        title: title,
      },
    });

    if (!find_book) throw new Error("there is no book by this title !");

    return res.status(200).send(find_book);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const bookID = req.params.isbn;

  if (books[bookID]) {
    return res.status(200).json(books[bookID].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

export const general_routes = public_users;
