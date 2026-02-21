
import { Debt, DebtCalculation, DebtStatus } from './types';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const calculateDebtDetails = (debt: Debt): DebtCalculation => {
  const today = new Date();
  const dueDate = new Date(debt.dueDate);
  const paidAmount = debt.payments.reduce((sum, p) => sum + p.amount, 0);
  
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - dueDate.getTime();
  const daysLate = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  
  // Cálculo de juros simples proporcional aos dias
  const dailyRate = (debt.interestRate / 100) / 30;
  const accruedInterest = daysLate > 0 ? debt.originalAmount * dailyRate * daysLate : 0;
  
  const totalDue = debt.originalAmount + accruedInterest;
  const remainingAmount = Math.max(0, totalDue - paidAmount);

  let status = DebtStatus.PENDING;
  if (remainingAmount <= 0) {
    status = DebtStatus.PAID;
  } else if (daysLate > 0) {
    status = DebtStatus.OVERDUE;
  } else if (daysLate >= -2) {
    status = DebtStatus.DUE_SOON;
  }

  return {
    accruedInterest,
    totalDue,
    daysLate,
    paidAmount,
    remainingAmount,
    status
  };
};

export const getStatusColor = (status: DebtStatus): string => {
  switch (status) {
    case DebtStatus.PAID: return 'bg-emerald-100 text-emerald-700';
    case DebtStatus.OVERDUE: return 'bg-rose-100 text-rose-700';
    case DebtStatus.DUE_SOON: return 'bg-amber-100 text-amber-700';
    default: return 'bg-blue-100 text-blue-700';
  }
};
