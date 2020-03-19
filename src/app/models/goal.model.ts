import { SortEnumType } from './shared.model';

export interface GoalType {
    _id: string;
    title?: string;
    description?: string;
    accomplishTenure?: Date;
    isPinned?: boolean;
    isAchieved?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface GoalFilterType {
    isPinned?: boolean;
    isAchieved?: boolean;
    q?: string;
}
export interface GoalSortType {
    createdAt?: SortEnumType;
    updatedAt?: SortEnumType;
    isPinned?: SortEnumType;
    isAchieved?: SortEnumType;
    accomplishTenure?: SortEnumType;
}

export interface GoalConditions {
  sort?: GoalSortType;
  filter?: GoalFilterType;
}

export interface GoalListType {
    data: GoalType[];
    totalCount: number;
}
