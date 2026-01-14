"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { createTransactionRTK } from "@/budget/budgetSlice";

// import type { Transaction } from "@/lib/api"

const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Rent",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
  "Salary",
  "Investment",
  "Other"
];



export function TransactionInput() {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((state) => state.budgetReducer);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !description || !category) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const transaction = {
      type,
      amount: Number.parseFloat(amount),
      description,
      category,
      date
    };


    dispatch(createTransactionRTK(transaction));

    setIsSubmitting(false);

    setAmount("");
    setDescription("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>
          Record a new income or expense transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <Select 
                value={type}
                onValueChange={(value: "income" | "expense") => setType(value)}>
                <SelectTrigger id="type" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="cursor-pointer">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="cursor-pointer">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input className="cursor-pointer"
                id="description"
                placeholder="e.g., Grocery shopping, Monthly salary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            size="lg"
            disabled={isSubmitting}>
            <PlusCircle className="mr-2 h-5 w-5" />
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
