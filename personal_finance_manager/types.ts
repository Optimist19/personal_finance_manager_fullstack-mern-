export interface BudgetType {
  _id?: string;
  category: string;
  amount: number;
}
export interface Notifications {
  id?: string;
  message: string;
}

export interface NotificationsAndIndexAndMessage {
  notifications: Notifications[];
  index: number;
  message: string;
}

export interface TransactionType {
  _id?: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface UserDetailType {
  email: string;
  password: string;
}

// export interface CreateTransactionType {
//     type: "income" | "expense";
//     amount: number;
//     description: string;
//     category: string;
//     date: string;
// }

// export interface UpdateTransactionType {
//     type: "income" | "expense";
//     amount: number;
//     description: string;
//     category: string;
//     date: string;
// }
