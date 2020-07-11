import { SortEnumType as ISortEnumType, ISuccessType, IGQLLoading } from './shared.model';
import { OperationEnumType as IOperationEnumType } from '../models/todo.model';

export type IGoalGQLNames = 'addThought' | 'updateThought' | 'deleteThought' | 'listThought';

export interface IGoalType {
  _id?: string;
  title?: string;
  description?: string;
  accomplishTenure?: Date;
  isPinned?: boolean;
  isAchieved?: boolean;
  isDelete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  operationType?: IOperationEnumType;
  conditions?: IGoalConditions;
}

export interface IGoalFilterType {
  isPinned?: boolean;
  isAchieved?: boolean;
  q?: string;
}
export interface IGoalSortType {
  createdAt?: ISortEnumType;
  updatedAt?: ISortEnumType;
  isPinned?: ISortEnumType;
  isAchieved?: ISortEnumType;
  accomplishTenure?: ISortEnumType;
}

export interface IGoalConditions {
  sort?: IGoalSortType;
  filter?: IGoalFilterType;
  limit?: number;
  offset?: number;
}

export interface IGoalListType extends IGQLLoading{
  data: IGoalType[];
  totalCount: number;
}

export interface IGoalResponseType {
  data?: {
    listThought?: IGoalListType;
    addThought?: ISuccessType;
    updateThought?: ISuccessType;
    deleteThought?: ISuccessType;
  };
  loading: boolean;
}
