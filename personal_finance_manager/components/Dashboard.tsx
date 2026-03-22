"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { BudgetType, TransactionType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import FinanceChart from "./FinanceChart";

export function Dashboard() {
  const { transactions, budgets } = useAppSelector(
    (state) => state.budgetReducer
  );
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount
  }));

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetRemaining = totalBudget - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {balance >= 0 ? "Positive balance" : "Negative balance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${totalIncome?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "income").length}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalExpenses?.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "expense").length}{" "}
              transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget > 0 ? `$${budgetRemaining?.toFixed(2)}` : "Not set"}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalBudget > 0
                ? budgetRemaining >= 0
                  ? "Within budget"
                  : "Over budget"
                : "Set budgets to track"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">
                  No expense data available
                </p>
              </div>
            ) : (
              <FinanceChart data={chartData} type="pie" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Comparison</CardTitle>
            <CardDescription>
              Compare spending across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">
                  No expense data available
                </p>
              </div>
            ) : (
              <FinanceChart data={chartData} type="bar" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium text-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} •{" "}
                    {new Date(transaction.date).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <span
                  className={`font-bold ${
                    transaction.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount?.toFixed(2)}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
