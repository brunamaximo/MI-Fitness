
import React, { useState, useEffect, useRef } from 'react';
import WorkoutSheet from './components/WorkoutSheet';
import { createEmptySheet } from './constants';
import { AppState, WorkoutSheetData } from './types';
import { generateWorkoutAI } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('mi-fitness-v10');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
    return {
      sheet1: createEmptySheet(false),
      sheet2: createEmptySheet(true),
    };
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mi-fitness-v10', JSON.stringify(state));
  }, [state]);

  const handleUpdateSheet = (key: keyof AppState, newData: WorkoutSheetData) => {
    if (key === 'logoUrl') return;
    
    const otherKey = key === 'sheet1' ? 'sheet2' : 'sheet1';
    
    const syncedState = {
      ...state,
      [key]: newData,
      [otherKey as 'sheet1' | 'sheet2']: {
        ...state[otherKey as 'sheet1' | 'sheet2'],
        studentName: newData.studentName,
        weekDays: newData.weekDays,
        endDate: newData.endDate
      }
    };
    
    setState(syncedState);
  };

  const clearAll = () => {
    if (confirm('Deseja limpar todos os dados das fichas?')) {
      setState(prev => ({
        ...prev,
        sheet1: createEmptySheet(false),
        sheet2: createEmptySheet(true),
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({ ...prev, logoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt) {
      alert('Descreva o treino para a IA gerar...');
      return;
    }
    setIsGenerating(true);
    const result = await generateWorkoutAI(aiPrompt, state.sheet1.studentName || 'Aluno');
    setIsGenerating(false);

    if (result && result.exercises) {
      const aiExercises = result.exercises;
      const sheet1Ex = [...state.sheet1.exercises];
      const sheet2Ex = [...state.sheet2.exercises];

      aiExercises.forEach((ex, i) => {
        if (i < 24) {
          sheet1Ex[i] = { ...sheet1Ex[i], ...ex, order: (i+1).toString() };
        } else if (i < 48) {
          sheet2Ex[i-24] = { ...sheet2Ex[i-24], ...ex, order: (i+1).toString() };
        }
      });

      setState(prev => ({
        ...prev,
        sheet1: { ...prev.sheet1, warmup: result.warmup || prev.sheet1.warmup, exercises: sheet1Ex },
        sheet2: { ...prev.sheet2, exercises: sheet2Ex }
      }));
    }
  };

  return (
    <div className="flex flex-col items-center p-2 bg-zinc-950 min-h-screen font-sans">
      <header className="no-print w-full max-w-7xl bg-zinc-900 p-5 rounded-3xl shadow-2xl mb-6 flex flex-col md:flex-row gap-4 items-center border-b-4 border-[#fbbf24]">
        <div className="bg-[#fbbf24] text-black p-3 px-6 rounded-xl font-black text-2xl italic flex flex-col items-center shrink-0">
          <span>MI</span>
          <span className="text-[10px] font-black tracking-widest -mt-1 uppercase">Fitness</span>
        </div>

        <div className="flex-grow w-full flex gap-3">
          <input
            type="text"
            placeholder="Ex: Treino Hipertrofia A/B (Peito/Costas)..."
            className="flex-grow bg-zinc-950 border border-zinc-800 text-white rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-[#fbbf24] outline-none transition-all placeholder-zinc-700 font-bold"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className={`bg-[#fbbf24] hover:bg-yellow-500 text-black px-8 py-3 rounded-2xl text-sm font-black transition-all active:scale-95 whitespace-nowrap ${isGenerating ? 'opacity-50' : ''}`}
          >
            {isGenerating ? 'GERANDO...' : 'IA GERAR'}
          </button>
        </div>

        <div className="flex gap-2 shrink-0">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleLogoUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-zinc-800 text-white px-6 py-3 rounded-2xl text-xs font-black border border-zinc-700 transition-all uppercase hover:bg-zinc-700"
          >
            📂 Logo
          </button>
          <button onClick={clearAll} className="bg-red-950/20 text-red-500 px-6 py-3 rounded-2xl text-xs font-black border border-red-900/30 transition-all uppercase hover:bg-red-900/40">
            Limpar
          </button>
          <button onClick={() => window.print()} className="bg-white text-black px-8 py-3 rounded-2xl text-sm font-black shadow-2xl flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all">
            🖨️ IMPRIMIR
          </button>
        </div>
      </header>

      {/* PRINT AREA - 297mm x 210mm (Landscape) */}
      <div className="print-area w-[297mm] h-[210mm] bg-white shadow-2xl flex p-[4mm] gap-[4mm] box-border overflow-hidden origin-top scale-[0.35] sm:scale-[0.5] md:scale-[0.6] lg:scale-[0.8] xl:scale-100 border border-zinc-200">
        <div className="flex-1 h-full">
          <WorkoutSheet
            data={state.sheet1}
            onUpdate={(d) => handleUpdateSheet('sheet1', d)}
            logoUrl={state.logoUrl}
            onLogoClick={() => fileInputRef.current?.click()}
          />
        </div>
        <div className="flex-1 h-full">
          <WorkoutSheet
            data={state.sheet2}
            onUpdate={(d) => handleUpdateSheet('sheet2', d)}
            logoUrl={state.logoUrl}
            onLogoClick={() => fileInputRef.current?.click()}
          />
        </div>
      </div>

      <footer className="no-print mt-10 mb-10 text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
        ESTILO MI FITNESS • PERFORMANCE & RESULTADO
      </footer>
    </div>
  );
};

export default App;
