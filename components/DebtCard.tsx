
import React from 'react';
import { Debt } from '../types';
import { calculateDebtDetails, formatCurrency, getStatusColor } from '../utils';

interface DebtCardProps {
  debt: Debt;
  onClick: (debt: Debt) => void;
}

const DebtCard: React.FC<DebtCardProps> = ({ debt, onClick }) => {
  const details = calculateDebtDetails(debt);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <button 
      onClick={() => onClick(debt)}
      className="w-full text-left p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] mb-4 flex gap-4"
    >
      <div className="shrink-0">
        {debt.debtorPhoto ? (
          <img 
            src={debt.debtorPhoto} 
            alt={debt.debtorName} 
            className="w-14 h-14 rounded-full object-cover border-2 border-slate-50"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg border-2 border-slate-50">
            {getInitials(debt.debtorName)}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-slate-800 text-base leading-tight truncate pr-2">{debt.debtorName}</h3>
          <span className={`shrink-0 text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full ${getStatusColor(details.status)}`}>
            {details.status}
          </span>
        </div>
        
        <p className="text-xs text-slate-400 mb-3">Vence: {new Date(debt.dueDate).toLocaleDateString('pt-BR')}</p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Saldo</p>
            <p className="text-lg font-black text-slate-900">{formatCurrency(details.remainingAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Original</p>
            <p className="text-sm font-medium text-slate-600">{formatCurrency(debt.originalAmount)}</p>
          </div>
        </div>
        
        {details.daysLate > 0 && details.status !== 'Pago' && (
          <div className="mt-3 pt-3 border-t border-dashed border-gray-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <p className="text-[10px] text-rose-600 font-bold uppercase">
              {details.daysLate} dias de atraso • {formatCurrency(details.accruedInterest)} juros
            </p>
          </div>
        )}
      </div>
    </button>
  );
};

export default DebtCard;
