import sequelize from "../cofing/db.js";
import { DataTypes } from "sequelize";

const all_books = sequelize.define(
  "books",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "books",
    freezeTableName: true,
    timestamps: false,
  }
);

async function syncModel() {
  try {
    await all_books.sync({ alter: true });

    console.log("Books table synced successfully");
  } catch (error) {
    console.error("error has happened with syncing books table");
  }
}
syncModel();

export default all_books;
