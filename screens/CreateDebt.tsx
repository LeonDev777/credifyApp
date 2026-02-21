
import React, { useState, useRef } from 'react';
import { Debt } from '../types';

interface CreateDebtProps {
  onSave: (debt: Omit<Debt, 'id' | 'createdAt' | 'payments'>) => void;
}

const CreateDebt: React.FC<CreateDebtProps> = ({ onSave }) => {
  const [debtorName, setDebtorName] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  // Iniciamos com a data mínima permitida para facilitar a navegação
  const [dueDate, setDueDate] = useState('2026-01-01');
  const [interestRate, setInterestRate] = useState('2.0');
  const [debtorPhoto, setDebtorPhoto] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDebtorPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtorName || !originalAmount || !dueDate || !interestRate) return;

    // Garantia adicional de validação no envio
    if (new Date(dueDate).getFullYear() < 2026) {
      alert("A data deve ser de 2026 em diante.");
      return;
    }

    onSave({
      debtorName,
      debtorPhoto,
      originalAmount: parseFloat(originalAmount),
      dueDate,
      interestRate: parseFloat(interestRate)
    });
  };

  return (
    <div className="p-6 bg-white min-h-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto Selector */}
        <div className="flex flex-col items-center mb-8">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-blue-400 transition-colors"
          >
            {debtorPhoto ? (
              <img src={debtorPhoto} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="flex flex-col items-center">
                <svg className="text-slate-300 mb-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Foto</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-[10px] font-bold">Alterar</span>
            </div>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
          <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Foto do Devedor (Opcional)</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome do Devedor</label>
          <input 
            type="text" 
            required
            value={debtorName}
            onChange={e => setDebtorName(e.target.value)}
            placeholder="Ex: Maria Oliveira"
            className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valor do Empréstimo (R$)</label>
          <input 
            type="number" 
            step="0.01"
            required
            value={originalAmount}
            onChange={e => setOriginalAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vencimento</label>
            <input 
              type="date" 
              required
              min="2026-01-01"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Juros/Mês (%)</label>
            <input 
              type="number" 
              step="0.1"
              required
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
          >
            Cadastrar Cobrança
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDebt;
