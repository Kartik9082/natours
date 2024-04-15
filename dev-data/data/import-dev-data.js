const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE.replace(
//   '<NEW_DATABSE_PASSWORD>',
//   process.env.NEW_DATABASE_PASSWORD,
// );
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB CONNNECTION ESTABLISHED"));

// Read JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// IMPORT DATA

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully Loaded");
  } catch (err) {
    console.log("ERROR :", err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted");
  } catch (err) {
    console.log("ERROR :", err);
  }
  process.exit();
};

// console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
