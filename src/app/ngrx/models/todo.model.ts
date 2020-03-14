import { SortEnumType } from './shared.model';

enum TodoPriorityEnumType {
  'p1',
  'p2',
  'p3',
  'p4'
}

interface TodoType {
  _id: string;
  title: string;
}

export interface TodoListType {
    data: TodoType[];
    totalCount: number;
}

export interface TodoFilterType {
  isCompleted?: boolean;
  title_contains?: string;
  labelId?: string;
  startAt?: Date;
  endAt?: Date;
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
