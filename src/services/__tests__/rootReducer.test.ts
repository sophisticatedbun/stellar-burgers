import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  ingredientsReducer,
  constructorReducer,
  feedReducer,
  orderReducer
} from '@slices';

describe('rootReducer', () => {
  const rootReducer = combineReducers({
    user: userReducer,
    ingredients: ingredientsReducer,
    burgerConstructor: constructorReducer,
    feed: feedReducer,
    order: orderReducer
  });

  it('Проверка инициализации rootReducer', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('order');
  });

  it('Проверка инициализации user слайс с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.user).toEqual({
      isAuthChecked: false,
      data: null,
      isLoading: false,
      error: null
    });
  });

  it('Проверка инициализации ingredients слайс с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка инициализации burgerConstructor слайс с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Проверка инициализации feed слайс с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.feed).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('Проверка инициализации order слайс с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.order).toEqual({
      orderRequest: false,
      orderModalData: null,
      orders: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка начального состояние при передаче undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.order).toBeDefined();
  });
});

