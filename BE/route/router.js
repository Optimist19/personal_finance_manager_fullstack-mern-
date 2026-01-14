const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const Transactions = require("../models/transactions");
const Budgets = require("../models/budgets");
const { hashPasswordFtn } = require("../utils/hashPassword");
const passport = require("passport");


// router.get("/", async (req, res) => {
//   if (!req.user || !req.user) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   const getAllUsers = await User.find();
//   res.status(200).json(getAllUsers);
// });


//This is the sign in end-point
router.post("/signin", passport.authenticate("local"),  (req, res) => {
  res.status(200).json({message: "Signed in successfully"});
});


//This is the register end-point
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPasswordFtn(password);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ error: "User already exists, please click on sign-in" });
  }

  const user = await User.create({ email, password: hashedPassword });
  // req.session.user = user._id;
  res.status(201).json(user);
});


//This is the log out end-point
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});


//This is the end-point to get a user tranasctions. NB All user's tranasctions and not an end point to get all tranasactions
router.get("/transactions", async (req, res) => {
  try {
    if (!req.user || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await Transactions.find({ userId: req.user._id });
    res.status(200).json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//This is the end-point for a user to make a tranasction.
router.post("/transactions", async (req, res) => {
  const { amount, type, description, category, date } = req.body;

  if (!req.user || !req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const newTransaction = new Transactions({
      userId: req.user._id,
      amount,
      type,
      description,
      category,
      date
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//This is the end-point to edit a user's tranasction.
router.put("/transactions/:id", async (req, res) => {
  if (!req.user || !req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { category, amount, type, date, description } = req.body;
    if (!category || !amount || !type || !date || !description) {
      return res.status(400).json({
        error: "Category, amount, type, date and description are to be provided"
      });
    }

    const updatedTransaction = await Transactions.findByIdAndUpdate(
      req.params.id,
      { category, amount, type, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transactions not found" });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//This is the end-point to get a user's tranasction.
router.delete("/transactions/:id", async (req, res) => {
  if (!req.user || !req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json({ error: "Transaction id is required to delete" });
    }

    await Transactions.findOneAndDelete({ _id: id });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//This is the end-point to get a user budget. 
router.get("/budgets", async (req, res) => {

  try {
    if (!req.user || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await Budgets.find({ userId: req.user._id });
    res.status(200).json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//This is the end-point for a user to make a budget.
router.post("/budgets", async (req, res) => {
  if (!req.user || !req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { category, amount } = req.body;
    if (!category || !amount) {
      return res
        .status(400)
        .json({ error: "Category and amount are required" });
    }

    const newBudget = new Budgets({
      userId: req.user._id,
      category,
      amount
    });
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
