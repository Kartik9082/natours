const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down.....");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

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
  .then(() => console.log("DB CONNNECTION ESTABLISHED 🙏🏻"));

// .catch((err) => console.log(err.message));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port} 🚀`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, ", " + err.message);
  console.log("Unhandled rejection:  💥 ", "Shutting Down ");
  server.close(() => {
    process.exit(1);
  });
});
