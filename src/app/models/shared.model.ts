import { IUserProfile, TodoType, IGoalType, IGoalConditions } from '../models';

export type SortEnumType = 'ASC' | 'DESC';

export type IOperationEnumType = 'ADD' | 'UPDATE' | 'DELETE';

export type ITemplateOperation = 'IS_ADD' | 'IS_UPDATE' | 'IS_DELETED' | 'IS_PINNED' | 'IS_ARCHIEVED';

export interface IGQLLoading {
  loading?: boolean;
}

export interface ISuccessType extends IGQLLoading{
  ok?: boolean;
  message?: string;
}

export interface IExternalModal {
  TODO_ADD?: boolean;
  TODO_UPDATE?: boolean;
  GOAL_ADD?: boolean;
  GOAL_UPDATE?: boolean;
  DATE_PICKER?: boolean;
  data?: {
    todo?: TodoType;
    goal?: IGoalType;
    formControlName?: string;
    conditions?: IGoalConditions;
  };
}

export interface ILanguage {
  name: string;
  value: string;
  logo: string;
}
export interface IAppData {
  config: {
    theme: string;
    tClass: string;
  };
  isLoggedIn: boolean;
  token: string;
  session: IUserProfile;
  lang: ILanguage;
}
