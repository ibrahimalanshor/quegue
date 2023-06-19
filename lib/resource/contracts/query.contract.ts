export interface SortValues {
  column: string;
  direction: 'asc' | 'desc';
}

export type ColumnsValues = Record<string, string[]>;
export type ValidRawColumns = Record<string, string>;
