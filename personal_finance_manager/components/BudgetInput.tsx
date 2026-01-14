"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createOrUpdateBudgetTLK,
  fetchBudgetsRTK,
  fetchTransactionsRTK
} from "@/budget/budgetSlice";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Rent",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
  "Other"
];

export function BudgetInput() {
  const dispatch = useAppDispatch();
  const { budgets, transactions } = useAppSelector(
    (state) => state.budgetReducer
  );
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    await dispatch(fetchTransactionsRTK());
    await dispatch(fetchBudgetsRTK());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !amount) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    dispatch(createOrUpdateBudgetTLK({ category, amount: parseFloat(amount) }));
    setIsSubmitting(false);

    setCategory("");
    setAmount("");
    loadData();
  };

  const getCategorySpending = (cat: string) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Budget</CardTitle>
          <CardDescription>
            Define spending limits for each category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget-category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="budget-category" className="cursor-pointer">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent >
                    {CATEGORIES.map((cat) => (
                      <SelectItem className="cursor-pointer" key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-amount">Budget Amount ($)</Label>
                <Input
                  id="budget-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              <Target className="mr-2 h-5 w-5" />
              {isSubmitting ? "Setting Budget..." : "Set Budget"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>
            Track your spending against set budgets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No budgets set yet</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const spent = getCategorySpending(budget.category);
                const percentage = (spent / budget.amount) * 100;
                const isOverBudget = spent > budget.amount;

                return (
                  <div key={budget._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">
                        {budget.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ${spent?.toFixed(2)} / ${budget?.amount?.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={isOverBudget ? "[&>div]:bg-red-500" : ""}
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          isOverBudget
                            ? "font-medium text-red-600 dark:text-red-400"
                            : "text-muted-foreground"
                        }>
                        {percentage?.toFixed(0)}% used
                      </span>
                      <span className="text-muted-foreground">
                        ${(budget.amount - spent)?.toFixed(2)} remaining
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
