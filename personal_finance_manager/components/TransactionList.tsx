"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Filter
} from "lucide-react";
import { TransactionType } from "@/types";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  deleteTransactionRTK,
  updateTransactionRTK
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
  "Salary",
  "Investment",
  "Other"
];

function TransactionList() {
  const { transactions } = useAppSelector((state) => state.budgetReducer);
  const dispatch = useAppDispatch();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [editingTransaction, setEditingTransaction] = useState<
    TransactionType | undefined
  >(undefined);
  const [editForm, setEditForm] = useState<Omit<TransactionType, "id"> | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {}, [count]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterCategory !== "all" && transaction.category !== filterCategory) {
      return false;
    }
    if (filterType !== "all" && transaction.type !== filterType) {
      return false;
    }
    return true;
  });

  const handleEdit = (transaction: TransactionType) => {
    setEditingTransaction(transaction);
    setEditForm({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: transaction.date
    });
  };

  const handleSaveEdit = () => {
    if (editingTransaction && editForm) {
      setIsSaving(true);

      if (editingTransaction._id) {
        dispatch(
          updateTransactionRTK({
            id: editingTransaction._id,
            editForm: editForm
          })
        );
      }
      setIsSaving(false);
      setEditingTransaction(undefined);
      setEditForm(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    dispatch(deleteTransactionRTK(id));
    setIsDeleting(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and manage all your financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="filter-category">
                <Filter className="mr-2 inline h-4 w-4" />
                Filter by Category
              </Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="filter-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="cursor-pointer">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="filter-type">Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type" className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem value="all" className="cursor-pointer">All Types</SelectItem>
                  <SelectItem value="income" className="cursor-pointer">Income</SelectItem>
                  <SelectItem value="expense" className="cursor-pointer">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction: TransactionType) => (
                <div
                  key={transaction._id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                      }`}>
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction?.amount?.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(transaction)}
                        disabled={isDeleting === transaction._id}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction._id!)}
                        disabled={isDeleting === transaction._id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!editingTransaction}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(undefined);
          }
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction details
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(value: "income" | "expense") =>
                    setEditForm({ ...editForm, type: value })
                  }>
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amount: Number.parseFloat(e.target.value)
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, category: value })
                  }>
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={new Date(editForm.date).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button className="cursor-pointer"
              variant="outline"
              onClick={() => setEditingTransaction(undefined)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving} className="cursor-pointer">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default TransactionList;
