import { State } from '@/types/state';
export interface TodoItem {
  id: number;
  comment: string;
  state: State;
}
