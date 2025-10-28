import sequelize from "../cofing/db.js";
import { DataTypes } from "sequelize";
import users from "./user.js";
import all_books from "./books.js";

const reviews_ = sequelize.define("reviews", {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  reviewer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  review_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

    references: {
      model: users,
      key: "user_id",
    },

    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  book_id: {
    type: DataTypes.INTEGER,
    allowNull: false,

    references: {
      model: all_books,
      key: "book_id",
    },

    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
});

async function sync_reviews() {
  try {
    await reviews_.sync({ alter: true });
    console.log("reviews table is synced with success!");
  } catch (error) {
    console.log("error has happened with syncing reviews table");
  }
}

sync_reviews();

export default reviews_;
