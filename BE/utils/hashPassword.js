const bcrypt = require("bcrypt");
const saltRounds = 10;

//The code basically help to convert user password into something another combination of strings to hide the real password of the user in the database.
async function hashPasswordFtn(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hash(password, salt);
}


// This code right here is used to compare the password of the user input with that from the database if they match.
async function comparePassword(plain, hashedPassword) {
  return bcrypt.compareSync(plain, hashedPassword);
}


module.exports = {hashPasswordFtn, comparePassword}