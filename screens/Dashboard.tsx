
import React, { useMemo, useState } from 'react';
import { Debt, DebtStatus } from '../types';
import { calculateDebtDetails, formatCurrency } from '../utils';
import DebtCard from '../components/DebtCard';

interface DashboardProps {
  debts: Debt[];
  onCreateClick: () => void;
  onDebtClick: (debt: Debt) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ debts, onCreateClick, onDebtClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDebts = useMemo(() => {
    return debts.filter(d => 
      d.debtorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [debts, searchTerm]);

  const totals = useMemo(() => {
    return debts.reduce((acc, debt) => {
      const details = calculateDebtDetails(debt);
      acc.totalReceivable += details.remainingAmount;
      if (details.status === DebtStatus.OVERDUE) {
        acc.totalOverdue += details.remainingAmount;
      }
      return acc;
    }, { totalReceivable: 0, totalOverdue: 0 });
  }, [debts]);

  const urgentDebt = useMemo(() => {
    const unpaid = debts
      .map(d => ({ debt: d, details: calculateDebtDetails(d) }))
      .filter(item => item.details.status !== DebtStatus.PAID);

    if (unpaid.length === 0) return null;

    return unpaid.sort((a, b) => new Date(a.debt.dueDate).getTime() - new Date(b.debt.dueDate).getTime())[0];
  }, [debts]);

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-900 p-5 rounded-2xl text-white shadow-lg shadow-slate-200">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total a Receber</p>
          <p className="text-lg font-bold truncate">{formatCurrency(totals.totalReceivable)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total em Atraso</p>
          <p className="text-lg font-bold text-rose-600 truncate">{formatCurrency(totals.totalOverdue)}</p>
        </div>
      </div>

      {debts.length > 0 && (
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Buscar devedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
      )}

      {urgentDebt && !searchTerm && (
        <div className={`mb-8 p-4 rounded-2xl border-l-4 shadow-sm flex items-center gap-4 ${
          urgentDebt.details.status === DebtStatus.OVERDUE 
            ? 'bg-rose-50 border-rose-500' 
            : 'bg-amber-50 border-amber-500'
        }`}>
          <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            urgentDebt.details.status === DebtStatus.OVERDUE ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <svg className="animate-bounce" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Urgente</p>
            <h4 className="text-sm font-bold text-slate-900 truncate">{urgentDebt.debt.debtorName}</h4>
            <p className="text-xs text-slate-600">
              {urgentDebt.details.status === DebtStatus.OVERDUE 
                ? `${urgentDebt.details.daysLate} dias de atraso` 
                : `Vence em ${new Date(urgentDebt.debt.dueDate).toLocaleDateString('pt-BR')}`}
            </p>
          </div>
          <button onClick={() => onDebtClick(urgentDebt.debt)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${urgentDebt.details.status === DebtStatus.OVERDUE ? 'bg-rose-600' : 'bg-amber-600'} text-white`}>
            Ver
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-slate-800">Minhas Cobranças</h2>
        <span className="text-xs text-slate-400 font-medium">{filteredDebts.length} de {debts.length}</span>
      </div>

      {filteredDebts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-10 text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h3 className="text-slate-800 font-bold mb-1">Nenhum resultado</h3>
          <p className="text-slate-500 text-sm mb-6">Tente outro nome ou adicione uma nova cobrança.</p>
          <button onClick={onCreateClick} className="bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-md">
            Novo Empréstimo
          </button>
        </div>
      ) : (
        <div className="pb-24">
          {filteredDebts.map(debt => (
            <DebtCard key={debt.id} debt={debt} onClick={onDebtClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
