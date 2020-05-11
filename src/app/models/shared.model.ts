import { IUserProfile } from '../models';

export type SortEnumType = 'ASC' | 'DESC';
export interface IExternalModal {
  TODO_ADD?: boolean;
  TODO_UPDATE?: boolean;
}

export interface IAppData {
  config: {
    theme: string;
  };
  isLoggedIn: boolean;
  token: string;
  session: IUserProfile;
}
