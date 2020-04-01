import { SortEnumType } from './shared.model';

enum TodoPriorityEnumType {
  'p1',
  'p2',
  'p3',
  'p4'
}

type TodoEnumType = 'today' | 'backlog' | 'pending';
export type OperationEnumType = 'ADD' | 'UPDATE' | 'DELETE';
export type PriorityEnumType = 'P1' | 'P2' | 'P3' | 'P4';

export interface SuccessType {
  message?: string;
  ok?: boolean;
}

export interface TodoType {
  _id: string;
  scheduling?: boolean;
  title?: string;
  scheduledDate?: Date;
  labelId?: string;
  label?: TodoLabelType[];
  isCompleted?: boolean;
  priority?: PriorityEnumType;
  operationType?: string;
}

export interface TodoLabelType {
  _id?: string;
  name?: string;
  operationType?: string;
}

export interface TodoFilterType {
  isCompleted?: boolean;
  title_contains?: string;
  labelId?: string;
  startAt?: Date;
  endAt?: Date;
  type?: TodoEnumType;
  priority?: TodoPriorityEnumType;
}
export interface TodoSortType {
  createdAt?: SortEnumType;
  updatedAt?: SortEnumType;
  scheduledDate?: SortEnumType;
  priority?: SortEnumType;
}

export interface TodoConditions {
  sort?: TodoSortType;
  filter?: TodoFilterType;
}

export interface TodoListType {
  data: TodoType[];
  totalCount: number;
}

export interface TodoCompletedListType {
  data: {
    _id: string;
    list: TodoType[];
  };
  totalCount: number;
}

export interface TodoLabelListType {
  data?: TodoLabelType[];
  totalCount: number;
}

// export interface TodoListResponseType {
//   todoList: {
//     data: TodoListType;
//   };
// }
