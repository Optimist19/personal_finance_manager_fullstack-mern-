"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet } from "lucide-react";

import {
  fetchBudgetsRTK,
  fetchTransactionsRTK,
  notificationsFtn,
  setNotifications
} from "@/budget/budgetSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { TransactionInput } from "./TransactionInput";
import Notification from "./Notification";
import { Dashboard } from "./Dashboard";
import TransactionList from "./TransactionList";
import { BudgetInput } from "./BudgetInput";
import LogOutComp from "./LogOutComp";
import Image from "next/image";

function HomeComp() {
  const { transactions, budgets, notifications } = useAppSelector(
    (state) => state.budgetReducer
  );
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await dispatch(fetchTransactionsRTK());
      await dispatch(fetchBudgetsRTK());
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const checkBudgetAlerts = () => {
      const categorySpending: Record<string, number> = {};

      transactions.forEach((transaction) => {
        if (transaction.type === "expense") {
          categorySpending[transaction.category] =
            (categorySpending[transaction.category] || 0) + transaction.amount;
        }
      });

      const newNotifications: { message: string; id?: string }[] = [];

      budgets.forEach((budget) => {
        const spent = categorySpending[budget.category] || 0;
        if (spent > budget.amount) {
          newNotifications.push({
            message: `Warning: You've exceeded your ${
              budget.category
            } budget by $${(spent - budget.amount)?.toFixed(2)}`
          });
        }
      });

      dispatch(setNotifications(newNotifications));
    };
    checkBudgetAlerts();
  }, [transactions, budgets]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading your financial data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-6">
          {/* <div className="container mx-auto px-4 py-6"> */}

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary cursor-pointer">
              <div>
                <Image
                  src="/pfm-logo.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="cursor-pointer">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Finance Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Track expenses, manage budgets, and visualize your financial
                health
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center fixed right-4 bottom-4 h-25 w-25 rounded-full bg-[#0f172b] md:hidden">
            <LogOutComp />
          </div>
          <div className="hidden md:block">
            <LogOutComp />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* {notifications.length > 0 && (
          <div className="mb-6">
            {notifications.map((message, index) => (
              <Notification
                key={index}
                message={message}
                onClose={() => dispatch(notificationsFtn({notifications, index}))}
              />
            ))}
          </div>
        )} */}

        {notifications.length > 0 && (
          <div className="mb-6">
            {notifications.map((note, index) => (
              <Notification
                key={index}
                // message={note.message}
                onClose={() =>
                  dispatch(
                    notificationsFtn({
                      notifications,
                      index,
                      message: note.message
                    })
                  )
                }
              />
            ))}
          </div>
        )}

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="cursor-pointer">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="cursor-pointer">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="add" className="cursor-pointer">
              Add Transaction
            </TabsTrigger>
            <TabsTrigger value="budget" className="cursor-pointer">
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <TransactionInput />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetInput />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
export default HomeComp;
