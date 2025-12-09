import feedReducer, { fetchFeed, FeedState } from '../feedSlice';
import { TOrder } from '@utils-types';

describe('feedSlice', () => {
  const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order-1',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2024-12-08T12:00:00.000Z',
      updatedAt: '2024-12-08T12:00:05.000Z',
      number: 12345,
      ingredients: ['bun-1', 'main-1', 'bun-1']
    },
    {
      _id: 'order-2',
      status: 'pending',
      name: 'Флюоресцентный бургер',
      createdAt: '2024-12-08T13:00:00.000Z',
      updatedAt: '2024-12-08T13:00:05.000Z',
      number: 12346,
      ingredients: ['bun-2', 'sauce-1', 'bun-2']
    }
  ];

  const mockFeedResponse = {
    orders: mockOrders,
    total: 50000,
    totalToday: 150
  };

  describe('Начальное состояние', () => {
    it('Проверка возврата начального состояния', () => {
      const state = feedReducer(undefined, { type: 'UNKNOWN' });

      expect(state).toEqual(initialState);
    });
  });

  describe('fetchFeed.pending', () => {
    it('Установка isLoading в true при отправке запроса', () => {
      const action = { type: fetchFeed.pending.type };
      const state = feedReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Сброс предыдущей ошибки при новом запросе', () => {
      const stateWithError: FeedState = {
        ...initialState,
        error: 'Previous error'
      };

      const action = { type: fetchFeed.pending.type };
      const state = feedReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchFeed.fulfilled', () => {
    it('Сохранение заказов и установка isLoading в false', () => {
      const loadingState: FeedState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(50000);
      expect(state.totalToday).toBe(150);
      expect(state.error).toBeNull();
    });

    it('Замена существующего заказа новыми', () => {
      const stateWithData: FeedState = {
        orders: [mockOrders[0]],
        total: 10000,
        totalToday: 50,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchFeed.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = feedReducer(stateWithData, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.orders).toHaveLength(2);
      expect(state.total).toBe(50000);
      expect(state.totalToday).toBe(150);
    });
  });

  describe('fetchFeed.rejected', () => {
    it('Сохранение ошибки и установка isLoading в false', () => {
      const loadingState: FeedState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchFeed.rejected.type,
        error: { message: 'Network error' }
      };
      const state = feedReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('Сохранение существующих данных при ошибке', () => {
      const stateWithData: FeedState = {
        orders: mockOrders,
        total: 50000,
        totalToday: 150,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchFeed.rejected.type,
        error: { message: 'Server error' }
      };
      const state = feedReducer(stateWithData, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(50000);
      expect(state.totalToday).toBe(150);
      expect(state.error).toBe('Server error');
    });
  });
});




