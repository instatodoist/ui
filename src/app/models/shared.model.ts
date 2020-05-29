import { IUserProfile, TodoType as IToDo, IGoalType } from '../models';

export type SortEnumType = 'ASC' | 'DESC';
export interface IExternalModal {
  TODO_ADD?: boolean;
  TODO_UPDATE?: boolean;
  GOAL_ADD?: boolean;
  GOAL_UPDATE?: boolean;
  data?: {
    todo?: IToDo,
    goal?: IGoalType
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
