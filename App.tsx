
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import CreateDebt from './screens/CreateDebt';
import DebtDetails from './screens/DebtDetails';
import Settings from './screens/Settings';
import { Debt, DebtStatus } from './types';
import { calculateDebtDetails } from './utils';

type Screen = 'dashboard' | 'create' | 'details' | 'settings';

const App: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>(() => {
    const saved = localStorage.getItem('credify_debts');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('credify_debts', JSON.stringify(debts));
  }, [debts]);

  const handleCreate = (data: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => {
    const newDebt: Debt = {
      ...data,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      payments: []
    };
    setDebts(prev => [newDebt, ...prev]);
    setCurrentScreen('dashboard');
  };

  const handlePayment = (amount: number, note: string) => {
    setDebts(prev => prev.map(d => {
      if (d.id === selectedId) {
        return { 
          ...d, 
          payments: [...d.payments, { id: Date.now().toString(), amount, date: new Date().toISOString(), note }] 
        };
      }
      return d;
    }));
  };

  const handleDelete = () => {
    if (confirm('Remover esta cobrança permanentemente?')) {
      setDebts(prev => prev.filter(d => d.id !== selectedId));
      setCurrentScreen('dashboard');
      setSelectedId(null);
    }
  };

  const handleClearPaid = () => {
    const paidCount = debts.filter(d => calculateDebtDetails(d).status === DebtStatus.PAID).length;
    if (paidCount === 0) return;
    if (confirm(`Remover permanentemente as ${paidCount} dívidas já quitadas?`)) {
      setDebts(prev => prev.filter(d => calculateDebtDetails(d).status !== DebtStatus.PAID));
    }
  };

  const handleImport = (importedDebts: Debt[]) => {
    setDebts(importedDebts);
    setCurrentScreen('dashboard');
  };

  const handleClearAll = () => {
    if (confirm('ATENÇÃO: Isso apagará TODAS as suas cobranças permanentemente. Continuar?')) {
      setDebts([]);
      setCurrentScreen('dashboard');
    }
  };

  const selectedDebt = debts.find(d => d.id === selectedId);

  const getTitle = () => {
    switch(currentScreen) {
      case 'create': return 'Nova Cobrança';
      case 'details': return 'Detalhes';
      case 'settings': return 'Configurações';
      default: return 'Credify';
    }
  };

  const fab = currentScreen === 'dashboard' ? (
    <button 
      onClick={() => setCurrentScreen('create')}
      className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all active:scale-95 border-2 border-white/10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
    </button>
  ) : null;

  return (
    <Layout 
      title={getTitle()} 
      onBack={currentScreen !== 'dashboard' ? () => setCurrentScreen('dashboard') : undefined}
      fab={fab}
      actions={currentScreen === 'dashboard' ? (
        <button onClick={() => setCurrentScreen('settings')} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      ) : null}
    >
      {currentScreen === 'dashboard' && (
        <Dashboard 
          debts={debts} 
          onCreateClick={() => setCurrentScreen('create')}
          onDebtClick={(d) => { setSelectedId(d.id); setCurrentScreen('details'); }}
        />
      )}
      {currentScreen === 'create' && <CreateDebt onSave={handleCreate} />}
      {currentScreen === 'details' && selectedDebt && (
        <DebtDetails debt={selectedDebt} onAddPayment={handlePayment} onDelete={handleDelete} />
      )}
      {currentScreen === 'settings' && (
        <Settings debts={debts} onImport={handleImport} onClearAll={handleClearAll} onClearPaid={handleClearPaid} />
      )}
    </Layout>
  );
};

export default App;
