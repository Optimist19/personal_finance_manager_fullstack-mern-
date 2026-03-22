const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { comparePassword } = require("../utils/hashPassword");

module.exports = function () {

  //The serializeUser runs once after authentication, that is it identifies a the user.
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });


  //The deserializeUser runs on every network request
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });


  //This is the specific strategy used for my authentication, I installed passport js and the specific specific passport strategy 
  passport.use(
    new LocalStrategy(
      { usernameField: "email" }, // The usernameField  is important when changing it default take to another thing, e.g email. The supposed parameter should be username and not email, but to override it, we have to ensure that the username that is supposed to be username will now be carrying email, overridding it we then do this { usernameField: "email" }
      async (email, password, done) => {
        try {
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            return done(null, false, { message: "No user found" });
          }

          const isMatch = await comparePassword(
            password,
            existingUser.password
          );

          if (!isMatch) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, existingUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
