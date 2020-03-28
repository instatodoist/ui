import { SortEnumType } from './shared.model';

enum TodoPriorityEnumType {
  'p1',
  'p2',
  'p3',
  'p4'
}

type TodoEnumType = 'today' | 'backlog' | 'pending';

export interface SuccessType {
  message?: string;
  ok?: boolean;
}

export interface TodoType {
  _id: string;
  noDate?: boolean;
  title?: string;
  scheduledDate?: Date;
  labelId?: string;
  label?: {
    name: string;
    _id: string;
  };
  isCompleted?: boolean;
}

export interface TodoLabelType {
  _id?: string;
  name?: string;
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
}

export interface TodoConditions {
  sort?: TodoSortType;
  filter?: TodoFilterType;
}

export interface TodoListType {
  data: TodoType[];
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
