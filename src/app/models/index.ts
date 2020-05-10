export * from './auth.model';
export * from './goal.model';
export * from './shared.model';
export * from './todo.model';

/** TODO: Need to remove */
import * as Todo from './todo.model'
import * as UserModel from './auth.model';
export {
    Todo,
    UserModel
};
