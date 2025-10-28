import sequelize from "../cofing/db.js";
import { DataTypes } from "sequelize";

const users = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    number: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        len: [5, 15],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

async function async_users() {
  try {
    await users.sync({ alter: true });
    console.log("users has been synced succefully ");
  } catch (error) {
    console.error("error has happened with syncing users table");
  }
}

async_users();

export default users;
