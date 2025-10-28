import express from "express";
import jwt from "jsonwebtoken";
import books from "../cofing/db.js";
import "dotenv/config";
import users from "../model/user.js";
const regd_users = express.Router();

// only registered users can login

regd_users.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username && password) {
      const existed_user = await users.findOne({
        where: {
          full_name: username,
        },
      });

      if (!existed_user)
        return res
          .status(404)
          .json({ message: "cridentials are incorrect ! plese try again." });

      if (existed_user.password === password) {
        let accessToken = jwt.sign(
          { data: username },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        return res
          .cookie("token", accessToken, {
            httpOnly: true,
          })
          .status(200)
          .json({
            message: "Login successful",
            username: existed_user.full_name,
          });
      }
    } else {
      return res
        .status(404)
        .json({ message: "please enter your username and password" });
    }
  } catch (err) {
    console.log(err);
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnID = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!username || !isbnID || !review) {
    return res.status(404).json({ message: "an error has occured" });
  }

  if (!books[isbnID]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbnID].review[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn],
  });
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnID = req.params.isbn;
  const username = req.session.username;

  if (!username || !isbnID) {
    return res.status(404).json({ message: "an error has occured" });
  }

  if (!books[isbnID]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbnID].reviews || !books[isbnID].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbnID].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbnID],
  });
});

export const auth_users = regd_users;
