require("dotenv").config();
const MongoStore = require("connect-mongo").default;
const  dns = require("node:dns");



const session = require("express-session");
const express = require("express");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./route/router");
const user = require("./models/user");
const initializePassport = require("./auth-strategy/local-strategy");
// OR
// require("./auth-strategy/local-strategy")()

const passport = require("passport");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

initializePassport();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database!!"))
  .catch((err) => console.log("Error connecting to Database !"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
