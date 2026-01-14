const MongoStore = require("connect-mongo").default;

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
const PORT = 5000;

app.use(express.json());

initializePassport()
mongoose
  .connect("mongodb://localhost:27017/personal_finance_manager")
  .then(() => console.log("Connected to Database!"))
  .catch((err) => console.log("Error connecting to Database !"));

app.use(
  session({
    secret: "secret_per-fin-man",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient()
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
