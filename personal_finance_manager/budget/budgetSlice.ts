import {
  BudgetType,
  Notifications,
  NotificationsAndIndexAndMessage,
  TransactionType,
  UserDetailType
} from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
  budgets: BudgetType[];
  transactions: TransactionType[];
  notifications: Notifications[];
  isLoading: boolean;
  error: string;
  success: string;
  message: string;
}

// Define the initial state using that type
const initialState: InitialStateType = {
  budgets: [],
  transactions: [],
  notifications: [],
  isLoading: false,
  error: "",
  success: "",
  message: "",
};

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    // setNotifications:(state, action: PayloadAction<Notifications[]>)=> {
    //   state.notifications = action.payload
    // },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    notificationsFtn: (
      state,
      action: PayloadAction<NotificationsAndIndexAndMessage>
    ) => {
      const { index, message } = action.payload;
      state.notifications = state.notifications.filter((_, i) => i !== index);
      state.message = message;
    }
  },
  extraReducers(builder) {
    //Budgets

    //fetchBudgets
    builder
      .addCase(fetchBudgetsRTK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudgetsRTK.fulfilled, (state, action) => {
        state.budgets = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading = false;
      })
      .addCase(fetchBudgetsRTK.rejected, (state) => {
        state.error = "Failed to fetch budgets";
        state.isLoading = false;
        state.budgets = [];
      });

    //createOrUpdateBudget
    builder
      .addCase(createOrUpdateBudgetTLK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrUpdateBudgetTLK.fulfilled, (state, action) => {
        if (action?.payload) {
          const addToExistingBudget = action?.payload;
          state.budgets.push(addToExistingBudget);

          state.isLoading = false;
        }
      })
      .addCase(createOrUpdateBudgetTLK.rejected, (state) => {
        state.error = "check your slice and see the line 43";
      });

    //Transaction

    //fetchTransactions
    builder
      .addCase(fetchTransactionsRTK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactionsRTK.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.transactions = payload;
        } else if (payload && typeof payload === "object") {
          state.transactions = [payload as TransactionType];
        } else {
          state.transactions = [];
        }
        state.isLoading = false;
      })
      .addCase(fetchTransactionsRTK.rejected, (state) => {
        state.error = "Failed to fetch transactions";
        state.isLoading = false;
      });

    //createTransaction
    builder
      .addCase(createTransactionRTK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTransactionRTK.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.transactions = payload;
        } else if (payload) {
          state.transactions.push(payload as TransactionType);
        }
        state.isLoading = false;
      })
      .addCase(createTransactionRTK.rejected, (state) => {
        state.error = "Failed to create transaction";
        state.isLoading = false;
      });

    // updateTransactions
    builder
      .addCase(updateTransactionRTK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTransactionRTK.fulfilled, (state, action) => {
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.transactions = payload;
        } else if (payload && typeof payload === "object") {
          const updated = payload as TransactionType;
          const idx = state.transactions.findIndex(
            (t) => t._id === updated._id
          );
          if (idx !== -1) state.transactions[idx] = updated;
          else state.transactions.push(updated);
        }
        state.isLoading = false;
      })
      .addCase(updateTransactionRTK.rejected, (state) => {
        state.error = "Failed to create transaction";
        state.isLoading = false;
      });

    // deleteTransactions
    builder
      .addCase(deleteTransactionRTK.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTransactionRTK.fulfilled, (state, action) => {
        const id = action.meta.arg; // Get the id from the thunk argument. The ID you thought would be gotten when returned from the thunk does not work that way, rather is done through action.meta.arg
        state.transactions = state.transactions.filter((t) => t._id !== id);
        state.message = "Transaction deleted successfully";
        state.isLoading = false;
      })
      .addCase(deleteTransactionRTK.rejected, (state) => {
        state.error = "Failed to delete transaction";
        state.isLoading = false;
      });

    //register
    builder
      .addCase(registerFtn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerFtn.fulfilled, (state) => {
        state.message = "Registration successful";
        state.isLoading = false;
      })
      .addCase(registerFtn.rejected, (state) => {
        state.error = "Failed to register";
        state.isLoading = false;
      });

    //sign-in
    builder
      .addCase(signInFtn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInFtn.fulfilled, (state, action) => {
        state.success = "Sign in successful";
        state.isLoading = false;
      })
      .addCase(signInFtn.rejected, (state) => {
        state.error = "Failed to sign in";
        state.isLoading = false;
      });

    //sign-out
    builder
      .addCase(logOutFTn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOutFTn.fulfilled, (state) => {
        state.success = "Log out successful";
        state.isLoading = false;
      })
      .addCase(logOutFTn.rejected, (state) => {
        state.error = "Failed to Logout";
        state.isLoading = false;
      });
  }
});

//Budget
export const fetchBudgetsRTK = createAsyncThunk("fetchBudgets", async () => {
  try {
    const response = await fetch(`/api/budgets`);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
});

export const createOrUpdateBudgetTLK = createAsyncThunk(
  "createOrUpdateBudget",
  async (budget: BudgetType) => {
    const { amount, category } = budget;
    try {
      const response = await fetch(`/api/budgets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, category })
      });
      const payload = await response.json();
      return payload;
    } catch (error) {
      const payload = error;
      return payload;
    }
  }
);

//Any Transaction related logic

export const fetchTransactionsRTK = createAsyncThunk(
  "fetchTransactions",
  async () => {
    try {
      const response = await fetch(`/api/transactions`);
      const data = await response.json();
      return data;
    } catch (error) {
      const payload = "Error fetching transactions";

      return payload;
    }
  }
);

export const createTransactionRTK = createAsyncThunk(
  "/createTransactions",
  async (transaction: TransactionType) => {
    try {
      const response = await fetch(`/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(transaction)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }
);

export const updateTransactionRTK = createAsyncThunk(
  "updateTransaction",
  async ({ id, editForm }: { id: string; editForm: TransactionType }) => {
    if (!id) throw new Error("Transaction ID is required for update");
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(editForm)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const deleteTransactionRTK = createAsyncThunk(
  "deleteTransaction",
  async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      await response.json();

      return id; // The ID you thought would be returned in the fulfilled case(builder), it doesn't work that way. The way to access the id is through action.meta.arg in the fulfilled case(builder). Though, what you are returning in this place does not have effect, but so far you returned something you are good to go.
    } catch (error) {
      return "Error deleting transaction";
    }
  }
);

//Auth logic
export const logOutFTn = createAsyncThunk("logOutFTn", async () => {
  try {
    const res = await fetch("/api/auth/log-out", {
      method: "POST"
    });

    const data = await res.json();
    const message = "Logged out successful";
    return message;
  } catch (error) {}
});

export const registerFtn = createAsyncThunk(
  "registerFtn",
  async (userData: UserDetailType) => {
    const { email, password } = userData;
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      const err = "Internal Server Error";
      return err;
    }
  }
);

export const signInFtn = createAsyncThunk(
  "signInFtn",
  async (userData: UserDetailType) => {
    const { email, password } = userData;
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      const err = "Internal Server Error";
      return err;
    }
  }
);

export const { setNotifications, notificationsFtn } = budgetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default budgetSlice.reducer;
