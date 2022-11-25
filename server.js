import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import session from "express-session";
import ejslayout from "express-ejs-layouts";
import { mongoDbConnection } from "./config/db.js";
import { localMiddleWare } from "./middleware/localsMiddleWare.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";

dotenv.config();
//PORT
const PORT = process.env.PORT || 9000;

//express init
const app = express();

//express middlware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//express-session setup
app.use(
  session({
    secret: "bbbd",
    resave: false,
    saveUninitialized: true,
  })
);

//express locals middleware
app.use(localMiddleWare);

//static folder
app.use(express.static("public"));

//ejs tamplate
app.set("view engine", "ejs");
app.set("layout", "layouts/app");
app.use(ejslayout);

//route
app.use("/", userRoute);

//listen
app.listen(PORT, () => {
  mongoDbConnection();
  console.log(`Server is running on ${PORT}`.bgGreen.black);
});
