
import React, { useState } from 'react';
import { Debt, Payment } from '../types';
import { calculateDebtDetails, formatCurrency, getStatusColor } from '../utils';
import { GoogleGenAI } from "@google/genai";

interface DebtDetailsProps {
  debt: Debt;
  onAddPayment: (amount: number, note: string) => void;
  onDelete: () => void;
}

const DebtDetails: React.FC<DebtDetailsProps> = ({ debt, onAddPayment, onDelete }) => {
  const details = calculateDebtDetails(debt);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!isNaN(amt) && amt > 0) {
      onAddPayment(amt, payNote);
      setPayAmount('');
      setPayNote('');
    }
  };

  const generateReminder = async () => {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    if (!apiKey) {
      setAiMessage('Configuração de API pendente no servidor.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Crie uma mensagem profissional e gentil para o devedor ${debt.debtorName}. 
      Status: ${details.status}. Valor: ${formatCurrency(details.remainingAmount)}. 
      Data de vencimento original: ${new Date(debt.dueDate).toLocaleDateString('pt-BR')}.
      Juros acumulados: ${formatCurrency(details.accruedInterest)}. 
      Foque em clareza financeira e mantenha um tom de confiança. Seja breve.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiMessage(response.text || 'Tente novamente em breve.');
    } catch (err) {
      setAiMessage('Erro ao gerar mensagem por IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-white p-6 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="shrink-0">
            {debt.debtorPhoto ? (
              <img 
                src={debt.debtorPhoto} 
                className="w-16 h-16 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                alt={debt.debtorName}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border-4 border-slate-50 shadow-sm">
                {getInitials(debt.debtorName)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full ${getStatusColor(details.status)} mb-1.5 inline-block`}>
              {details.status}
            </span>
            <h2 className="text-xl font-bold text-slate-900 truncate leading-none">{debt.debtorName}</h2>
          </div>
          <button onClick={onDelete} className="p-2 text-rose-400 hover:text-rose-600 transition-colors self-start" title="Excluir Cobrança">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>

        <div className="flex justify-between items-center py-4 border-t border-gray-50">
          <span className="text-xs font-bold text-slate-400 uppercase">Saldo Atualizado</span>
          <span className="text-3xl font-black text-slate-900">{formatCurrency(details.remainingAmount)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Juros Totais</p>
            <p className="font-bold text-rose-600">+{formatCurrency(details.accruedInterest)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] uppercase font-bold text-slate-400">Vencimento Original</p>
            <p className="font-bold text-slate-700">{new Date(debt.dueDate).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <svg className="text-blue-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            <h3 className="text-sm font-bold text-blue-900">Credify AI - Sugestão</h3>
          </div>
          
          {aiMessage && (
            <div className="bg-white p-4 rounded-xl border border-blue-200 text-sm text-slate-700 mb-4 whitespace-pre-line leading-relaxed italic relative">
              "{aiMessage}"
              <button 
                onClick={() => navigator.clipboard.writeText(aiMessage)}
                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
          )}
          
          <button 
            onClick={generateReminder}
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-xs transition-opacity disabled:opacity-50"
          >
            {isGenerating ? 'Gerando...' : (aiMessage ? 'Regerar Mensagem' : 'Gerar Texto p/ WhatsApp')}
          </button>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Histórico de Pagamentos</h3>
          {debt.payments.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-xs text-slate-400 font-medium">Nenhum pagamento registrado ainda.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {debt.payments.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-sm font-black text-slate-800">{formatCurrency(p.amount)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(p.date).toLocaleDateString('pt-BR')} {p.note && `• ${p.note}`}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {details.status !== 'Pago' && (
          <form onSubmit={handleAddPayment} className="bg-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registrar Pagamento</h3>
            <input 
              type="number" step="0.01" required value={payAmount}
              onChange={e => setPayAmount(e.target.value)}
              placeholder="Valor Recebido R$"
              className="w-full bg-slate-800 border-0 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input 
              type="text" value={payNote}
              onChange={e => setPayNote(e.target.value)}
              placeholder="Nota (Ex: PIX, Dinheiro)"
              className="w-full bg-slate-800 border-0 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition-all active:scale-[0.98]">
              Confirmar Recebimento
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DebtDetails;
