
export interface ExerciseRow {
  group: string;
  order: string;
  exercise: string;
  kg: string;
  sets: string;
  reps: string;
  obs: string;
}

export interface WorkoutSheetData {
  trainingSplit: string;
  trainingDayName: string;
  studentName: string;
  birthDate: string;
  startDate: string;
  endDate: string;
  weekDays: string[];
  warmup: string;
  exercises: ExerciseRow[];
  sideLabels: string[]; // Rótulos verticais "TREINO/DIA"
}

export interface AppState {
  sheet1: WorkoutSheetData;
  sheet2: WorkoutSheetData;
  logoUrl?: string;
}
