import { IUserProfile, TodoType, IGoalType } from '../models';

export type SortEnumType = 'ASC' | 'DESC';
export interface IExternalModal {
  TODO_ADD?: boolean;
  TODO_UPDATE?: boolean;
  GOAL_ADD?: boolean;
  GOAL_UPDATE?: boolean;
  DATE_PICKER?: boolean;
  data?: {
    todo?: TodoType,
    goal?: IGoalType,
    formControlName?: string
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
