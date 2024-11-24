export type VariableType = 'blood' | 'diet' | 'supplement' | 'lifestyle' | 'sleep' | 'exercise';

export interface Variable {
  name: string;
  type: VariableType;
  unit: string;
  normalRange?: {
    min: number;
    max: number;
  };
  description?: string;
  active: boolean;
}

export interface HealthData {
  date: string;
  [key: string]: string | number;
}

export interface Correlation {
  variable1: string;
  variable2: string;
  correlation: number;
  pValue: number;
}