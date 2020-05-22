export * from './auth.model';
export * from './goal.model';
export * from './shared.model';
export * from './todo.model';

/** TODO: Need to remove */
import * as UserModel from './auth.model';
export { UserModel };

export interface ILink {
  name: string;
  icon: string;
  link: string;
}
export interface INavLink {
  name: string;
  icon: string;
  link?: string;
  children?: ILink[];
  active?: boolean;
}
