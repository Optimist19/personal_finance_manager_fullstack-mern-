//This file is use to basically define transactions schema, i.e, type structure.


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", //user reference, making sure user id is present in this collection to get the things peculiar to the user.
      required: true
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    date: {
      type: Date, //better than string
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
