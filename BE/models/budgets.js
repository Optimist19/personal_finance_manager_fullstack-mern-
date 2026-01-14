//This file is use to basically define budgets schema, i.e, type structure.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", //user reference, making sure user id is present in this collection to get the things peculiar to the user.
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Budget", BudgetSchema);
