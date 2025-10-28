import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { auth_users } from "./router/auth_users.js";
import { general_routes } from "./router/general.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.cookies) {
    let token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = process.env.PORT || 5000;

app.use("/customer", auth_users);
app.use("/", general_routes);

app.listen(PORT, () => console.log("Server is running at port " + PORT));
