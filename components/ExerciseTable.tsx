
import React from 'react';
import { ExerciseRow } from '../types';
import { EXERCISE_DATABASE } from '../constants';

interface ExerciseTableProps {
  exercises: ExerciseRow[];
  groupName: string;
  onUpdate: (order: string, field: keyof ExerciseRow, value: string) => void;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({ exercises, groupName, onUpdate }) => {
  const listId = `list-${groupName.replace(/\s+/g, '-')}`;
  const suggestions = EXERCISE_DATABASE[groupName] || [];

  return (
    <div className="mb-1.5">
      <datalist id={listId}>
        {suggestions.map((ex, i) => <option key={i} value={ex} />)}
      </datalist>
      <table className="w-full border-collapse border border-black text-[9px] leading-tight table-fixed">
        <thead>
          <tr className="bg-[#fbbf24] text-black font-black uppercase">
            <th className="border border-black px-1 py-0.5 w-[22%] text-left">Grupo Muscular</th>
            <th className="border border-black px-1 py-0.5 w-[6%]">N°</th>
            <th className="border border-black px-1 py-0.5 w-[42%] text-left">Exercícios</th>
            <th className="border border-black px-1 py-0.5 w-[8%]">Série</th>
            <th className="border border-black px-1 py-0.5 w-[8%]">Reps</th>
            <th className="border border-black px-1 py-0.5 w-[14%]">Observações</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((row, idx) => (
            <tr key={idx} className="h-5">
              <td className="border border-black font-bold px-1 whitespace-nowrap overflow-hidden bg-gray-50 flex items-center h-full">
                <span className="truncate">{idx === 0 ? groupName : ''}</span>
              </td>
              <td className="border border-black text-center font-bold">{row.order}</td>
              <td className="border border-black">
                <input
                  list={listId}
                  type="text"
                  value={row.exercise}
                  onChange={(e) => onUpdate(row.order, 'exercise', e.target.value)}
                  className="w-full h-full px-1 border-none focus:outline-none focus:bg-yellow-50"
                  placeholder="Selecione..."
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  value={row.sets}
                  onChange={(e) => onUpdate(row.order, 'sets', e.target.value)}
                  className="w-full h-full px-1 border-none text-center focus:outline-none focus:bg-yellow-50"
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  value={row.reps}
                  onChange={(e) => onUpdate(row.order, 'reps', e.target.value)}
                  className="w-full h-full px-1 border-none text-center focus:outline-none focus:bg-yellow-50"
                />
              </td>
              <td className="border border-black">
                <input
                  type="text"
                  value={row.obs}
                  onChange={(e) => onUpdate(row.order, 'obs', e.target.value)}
                  className="w-full h-full px-1 border-none focus:outline-none focus:bg-yellow-50 italic"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseTable;
