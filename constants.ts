
import { WorkoutSheetData, ExerciseRow } from './types';

export const EXERCISE_DATABASE: Record<string, string[]> = {
  'Peito': ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Peck Deck', 'Crossover', 'Supino Halter'],
  'Costas': ['Puxada Alta', 'Remada Baixa', 'Remada Curvada', 'Serrote', 'Barra Fixa', 'Pulldown'],
  'Pernas': ['Agachamento', 'Leg Press', 'Extensora', 'Flexora', 'Stiff', 'Afundo', 'Hack'],
  'Ombro': ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Crucifixo Inverso'],
  'Bíceps': ['Rosca Direta', 'Rosca Alternada', 'Rosca Martelo', 'Rosca Scott'],
  'Tríceps': ['Tríceps Pulley', 'Tríceps Corda', 'Tríceps Testa', 'Tríceps Francês'],
  'Abs': ['Abdominal Supra', 'Abdominal Infra', 'Prancha', 'Abdominal Remador'],
  'Glúteo': ['Elevação Pélvica', 'Cadeira Abdutora', 'Glúteo 4 Apoios', 'Glúteo no Cabo', 'Glúteo Máquina', 'Extensão de Quadril'],
  'Abs/Cardio': ['Abdominal Supra', 'Abdominal Infra', 'Prancha', 'Esteira', 'Bike', 'Elíptico'],
  'Cardio': ['Esteira', 'Bike', 'Elíptico']
};

export const createEmptySheet = (isSecondPage: boolean = false): WorkoutSheetData => {
  const exercises: ExerciseRow[] = [];
  
  // Ficha A: Peito (6), Costas (8), Ombro (6), Abs (4) = 24
  // Ficha B: Pernas (8), Bíceps (5), Tríceps (5), Glúteo (6) = 24
  const groups = isSecondPage 
    ? [
        { name: 'Pernas', size: 8 }, 
        { name: 'Bíceps', size: 5 }, 
        { name: 'Tríceps', size: 5 }, 
        { name: 'Glúteo', size: 6 }
      ]
    : [
        { name: 'Peito', size: 6 }, 
        { name: 'Costas', size: 8 }, 
        { name: 'Ombro', size: 6 },
        { name: 'Abs', size: 4 }
      ];

  let orderCounter = 1;
  groups.forEach(g => {
    for (let i = 0; i < g.size; i++) {
      exercises.push({
        group: i === 0 ? g.name : '',
        order: orderCounter.toString(),
        exercise: '',
        kg: '',
        sets: '',
        reps: '',
        obs: ''
      });
      orderCounter++;
    }
  });

  return {
    trainingSplit: isSecondPage ? 'B' : 'A',
    trainingDayName: '',
    studentName: '',
    birthDate: '',
    startDate: '',
    endDate: '',
    weekDays: [],
    warmup: '',
    exercises: exercises,
    sideLabels: Array(groups.length).fill('') 
  };
};

export const WEEK_DAYS_LABELS = [
  { id: 'SEG', label: 'SEG' },
  { id: 'TER', label: 'TER' },
  { id: 'QUA', label: 'QUA' },
  { id: 'QUI', label: 'QUI' },
  { id: 'SEX', label: 'SEX' },
  { id: 'SÁB', label: 'SÁB' },
];
