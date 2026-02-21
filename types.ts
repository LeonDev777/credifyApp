
export enum DebtStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  OVERDUE = 'Atrasado',
  DUE_SOON = 'Vence em breve'
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface Debt {
  id: string;
  debtorName: string;
  debtorPhoto?: string; // String base64
  originalAmount: number;
  dueDate: string;
  interestRate: number; // Porcentagem mensal
  payments: Payment[];
  createdAt: string;
}

export interface DebtCalculation {
  accruedInterest: number;
  totalDue: number;
  daysLate: number;
  paidAmount: number;
  remainingAmount: number;
  status: DebtStatus;
}
