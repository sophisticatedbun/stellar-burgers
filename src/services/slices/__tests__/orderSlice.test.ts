import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  fetchUserOrders,
  clearOrderModalData,
  OrderState
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const initialState: OrderState = {
    orderRequest: false,
    orderModalData: null,
    orders: [],
    isLoading: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: 'order-1',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2024-12-08T12:00:00.000Z',
    updatedAt: '2024-12-08T12:00:05.000Z',
    number: 12345,
    ingredients: ['bun-1', 'main-1', 'bun-1']
  };

  const mockOrders: TOrder[] = [
    mockOrder,
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

  describe('Начальное состояние', () => {
    it('Проверка возврата начального состояния', () => {
      const state = orderReducer(undefined, { type: 'UNKNOWN' });

      expect(state).toEqual(initialState);
    });
  });

  describe('Синхронные экшены', () => {
    it('clearOrderModalData очищает данные модального окна заказа', () => {
      const stateWithOrder: OrderState = {
        ...initialState,
        orderModalData: mockOrder
      };

      const state = orderReducer(stateWithOrder, clearOrderModalData());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('createOrder', () => {
    it('Зending: установка orderRequest в true', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохранение заказа и установка orderRequest в false', () => {
      const loadingState: OrderState = {
        ...initialState,
        orderRequest: true
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(loadingState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('Rejected: сохранение ошибки и установка orderRequest в false', () => {
      const loadingState: OrderState = {
        ...initialState,
        orderRequest: true
      };

      const action = {
        type: createOrder.rejected.type,
        error: { message: 'Failed to create order' }
      };
      const state = orderReducer(loadingState, action);

      expect(state.orderRequest).toBe(false);
      expect(state.error).toBe('Failed to create order');
    });
  });

  describe('FetchOrderByNumber', () => {
    it('Pending: установка isLoading в true', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохранение заказа в orderModalData', () => {
      const loadingState: OrderState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });

    it('Rejected: сохранение ошибки', () => {
      const loadingState: OrderState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'Order not found' }
      };
      const state = orderReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Order not found');
    });
  });

  describe('fetchUserOrders', () => {
    it('Pending: установка isLoading в true', () => {
      const action = { type: fetchUserOrders.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Fulfilled: сохранение списка заказов', () => {
      const loadingState: OrderState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockOrders
      };
      const state = orderReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.orders).toHaveLength(2);
    });

    it('Rejected: сохранение ошибки', () => {
      const loadingState: OrderState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchUserOrders.rejected.type,
        error: { message: 'Unauthorized' }
      };
      const state = orderReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Unauthorized');
    });
  });
});
