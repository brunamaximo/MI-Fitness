
import React from 'react';
import { WorkoutSheetData, ExerciseRow } from '../types';
import { WEEK_DAYS_LABELS, EXERCISE_DATABASE } from '../constants';

interface WorkoutSheetProps {
  data: WorkoutSheetData;
  onUpdate: (newData: WorkoutSheetData) => void;
  logoUrl?: string;
  onLogoClick?: () => void;
}

const WorkoutSheet: React.FC<WorkoutSheetProps> = ({ data, onUpdate, logoUrl, onLogoClick }) => {
  const handleFieldChange = (field: keyof WorkoutSheetData, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleExerciseChange = (index: number, field: keyof ExerciseRow, value: string) => {
    const newExercises = [...data.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    onUpdate({ ...data, exercises: newExercises });
  };

  const handleSideLabelChange = (index: number, value: string) => {
    const newSideLabels = [...(data.sideLabels || [])];
    newSideLabels[index] = value;
    handleFieldChange('sideLabels', newSideLabels);
  };

  const handleDayToggle = (day: string) => {
    const newDays = data.weekDays.includes(day)
      ? data.weekDays.filter(d => d !== day)
      : [...data.weekDays, day];
    handleFieldChange('weekDays', newDays);
  };

  const isSecondPage = data.trainingSplit === 'B';
  const groupConfig = isSecondPage ? [8, 5, 5, 6] : [8, 8, 8];

  const getRowStartIndex = (groupIdx: number) => {
    return groupConfig.slice(0, groupIdx).reduce((acc, curr) => acc + curr, 0);
  };

  return (
    <div className="p-[4px] flex flex-col h-full bg-white text-black overflow-hidden box-border border-[3px] border-black">
      {/* HEADER */}
      <div className="flex gap-[8px] mb-[4px] items-stretch shrink-0 h-[70px] border-b-[3px] border-black pb-[4px]">
        {/* LOGO AREA */}
        <div 
          onClick={onLogoClick}
          className="w-[65px] h-[65px] bg-black text-[#FFD700] flex items-center justify-center text-[9px] text-center cursor-pointer border-2 border-dashed border-[#FFD700] overflow-hidden shrink-0"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span>CLIQUE<br/>P/ LOGO</span>
          )}
        </div>

        {/* HEADER FIELDS */}
        <div className="flex-grow flex flex-col justify-between overflow-hidden">
          <div className="bg-black text-[#FFD700] text-center font-black py-[3px] text-[15px] tracking-widest uppercase italic">
            FICHA DE TREINO - PARTE {data.trainingSplit}
          </div>
          <div className="grid grid-cols-12 gap-[5px] items-end">
            <div className="col-span-7 flex flex-col">
              <label className="text-[8px] font-bold text-black uppercase">Aluno(a):</label>
              <input 
                type="text" 
                value={data.studentName}
                onChange={(e) => handleFieldChange('studentName', e.target.value)}
                className="w-full border-b border-gray-400 outline-none text-[11px] font-bold h-[18px] uppercase bg-transparent px-1" 
              />
            </div>
            <div className="col-span-5 flex flex-col">
              <label className="text-[8px] font-bold text-black uppercase">Vencimento:</label>
              <input 
                type="text" 
                value={data.endDate}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                className="w-full border-b border-gray-400 outline-none text-[10px] h-[18px] text-center bg-transparent" 
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="bg-[#FFD700] border border-black flex justify-between items-center px-[4px] py-[2px] mb-[4px] shrink-0 font-bold text-[9px]">
        {WEEK_DAYS_LABELS.map(day => (
          <label key={day.id} className="flex items-center gap-[2px] cursor-pointer">
            <input 
              type="checkbox" 
              checked={data.weekDays.includes(day.id)}
              onChange={() => handleDayToggle(day.id)}
              className="w-[12px] h-[12px] border border-black accent-black bg-white" 
            />
            <span className="text-black">{day.label}</span>
          </label>
        ))}
      </div>

      {/* TABLE */}
      <div className="flex-grow border border-black bg-white overflow-hidden">
        <table className="w-full border-collapse table-fixed h-full text-[10px]">
          <thead>
            <tr className="bg-black text-[#FFD700] font-black uppercase text-center text-[8px] h-[20px]">
              <th className="border-r border-white w-[55px]">GRUPO</th>
              <th className="border-r border-white w-[22px]">Nº</th>
              <th className="border-r border-white">EXERCÍCIO</th>
              <th className="border-r border-white w-[35px]">KG</th>
              <th className="border-r border-white w-[35px]">SÉRIES</th>
              <th className="border-r border-white w-[35px]">REPS</th>
              <th className="w-[160px]">OBS</th>
            </tr>
          </thead>
          <tbody>
            {groupConfig.map((groupSize, groupIdx) => {
              const startIdx = getRowStartIndex(groupIdx);
              return Array.from({ length: groupSize }).map((_, localIdx) => {
                const globalIdx = startIdx + localIdx;
                const row = data.exercises[globalIdx];

                return (
                  <tr key={globalIdx} className="border-b border-black last:border-0 h-[21.5px]">
                    {localIdx === 0 && (
                      <td rowSpan={groupSize} className="border-r border-black p-0 h-full">
                        <div className="flex h-full w-full items-center">
                          {/* VERTICAL TAB (TREINO/DIA) */}
                          <div className="w-[18px] h-full border-r border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                             <input 
                                type="text"
                                value={data.sideLabels[groupIdx] || ''}
                                onChange={(e) => handleSideLabelChange(groupIdx, e.target.value.toUpperCase())}
                                placeholder="TREINO"
                                className="absolute w-[80px] h-full bg-transparent text-center font-black text-[7px] outline-none border-none -rotate-90 uppercase whitespace-nowrap"
                              />
                          </div>
                          {/* GROUP NAME (VERTICAL) */}
                          <div className="flex-grow h-full flex items-center justify-center overflow-hidden relative">
                            <input 
                              type="text" 
                              value={row.group}
                              onChange={(e) => handleExerciseChange(globalIdx, 'group', e.target.value)}
                              placeholder="GRUPO"
                              className="absolute w-[120px] h-full bg-transparent text-center outline-none border-none font-black text-[10px] uppercase -rotate-90 whitespace-nowrap"
                            />
                          </div>
                        </div>
                      </td>
                    )}

                    <td className="border-r border-black text-center font-bold text-black p-0 text-[9px]">
                      {row.order}
                    </td>
                    <td className="border-r border-black relative p-0">
                      <input 
                        type="text" 
                        value={row.exercise}
                        list={`list-${globalIdx}`}
                        onChange={(e) => handleExerciseChange(globalIdx, 'exercise', e.target.value)}
                        className="w-full h-full px-[4px] outline-none border-none bg-transparent font-medium text-[10px]"
                      />
                      <datalist id={`list-${globalIdx}`}>
                        {EXERCISE_DATABASE[data.exercises[startIdx].group]?.map(ex => <option key={ex} value={ex} />)}
                      </datalist>
                    </td>
                    <td className="border-r border-black p-0 text-center">
                      <input 
                        type="text" 
                        value={row.kg}
                        onChange={(e) => handleExerciseChange(globalIdx, 'kg', e.target.value)}
                        className="w-full h-full text-center outline-none border-none bg-transparent font-bold text-[10px]"
                      />
                    </td>
                    <td className="border-r border-black p-0 text-center">
                      <input 
                        type="text" 
                        value={row.sets}
                        onChange={(e) => handleExerciseChange(globalIdx, 'sets', e.target.value)}
                        className="w-full h-full text-center outline-none border-none bg-transparent font-bold text-[10px]"
                      />
                    </td>
                    <td className="border-r border-black p-0 text-center">
                      <input 
                        type="text" 
                        value={row.reps}
                        onChange={(e) => handleExerciseChange(globalIdx, 'reps', e.target.value)}
                        className="w-full h-full text-center outline-none border-none bg-transparent font-bold text-[10px]"
                      />
                    </td>
                    <td className="p-0">
                      <input 
                        type="text" 
                        value={row.obs}
                        onChange={(e) => handleExerciseChange(globalIdx, 'obs', e.target.value)}
                        className="w-full h-full px-[2px] italic text-[8px] outline-none border-none bg-transparent"
                      />
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="text-[8px] mt-[2px] shrink-0 flex justify-between font-black italic text-zinc-400 px-[2px]">
        <span>MI FITNESS STYLE</span>
        <span className="uppercase opacity-40">MUDANÇA INTERNA • RESULTADO EXTERNO</span>
      </div>
    </div>
  );
};

export default WorkoutSheet;
