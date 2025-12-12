import userReducer, {
  setAuthChecked,
  setUser,
  clearUser,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  checkUserAuth,
  initialState
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('Начальное состояние', () => {
    it('Проверка возврата начального состояния', () => {
      const state = userReducer(undefined, { type: 'UNKNOWN' });

      expect(state).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    it('setAuthChecked устанавливает флаг проверки авторизации', () => {
      const state = userReducer(initialState, setAuthChecked(true));

      expect(state.isAuthChecked).toBe(true);
    });

    it('setUser устанавливает данные пользователя', () => {
      const state = userReducer(initialState, setUser(mockUser));

      expect(state.data).toEqual(mockUser);
    });

    it('clearUser очищает данные пользователя', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser
      };

      const state = userReducer(stateWithUser, clearUser());

      expect(state.data).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const action = { type: registerUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохраняет пользователя и установить isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Rejected: сохраняет ошибку и устанавливает isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Email already exists' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Email already exists');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохраняет пользователя и устанавливает isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Rejected: сохраняет ошибку и устанавливает isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Invalid credentials' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('getUser', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const action = { type: getUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохраняет пользователя и устанавливает isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
    });

    it('Rejected: сохраняет ошибку и устанавливает isLoading в false', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: getUser.rejected.type,
        error: { message: 'Unauthorized' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Unauthorized');
    });
  });

  describe('updateUser', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const action = { type: updateUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: обновляет данные пользователя', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser,
        isLoading: true
      };

      const updatedUser: TUser = {
        email: 'test@example.com',
        name: 'Updated Name'
      };

      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(updatedUser);
    });

    it('Rejected: сохраняет ошибку', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Update failed' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Update failed');
    });
  });

  describe('logoutUser', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser
      };

      const action = { type: logoutUser.pending.type };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: очищает данные пользователя', () => {
      const stateWithUser = {
        ...initialState,
        data: mockUser,
        isLoading: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const state = userReducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
    });

    it('Rejected: сохраняет ошибку', () => {
      const loadingState = {
        ...initialState,
        data: mockUser,
        isLoading: true
      };

      const action = {
        type: logoutUser.rejected.type,
        error: { message: 'Logout failed' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('checkUserAuth', () => {
    it('Pending: устанавливает isLoading в true', () => {
      const action = { type: checkUserAuth.pending.type };
      const state = userReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: устанавливает данные пользователя и isAuthChecked в true', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('Fulfilled с null: устанавливает isAuthChecked в true без пользователя', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: null
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('Rejected: устанавливает isAuthChecked в true с ошибкой', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: checkUserAuth.rejected.type,
        error: { message: 'Token expired' }
      };
      const state = userReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Token expired');
      expect(state.isAuthChecked).toBe(true);
    });
  });
});
