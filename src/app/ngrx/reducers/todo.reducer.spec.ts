import { _todoReducer, initialState } from './todo.reducer';

describe('Todo Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = _todoReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
