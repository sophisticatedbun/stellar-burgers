import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  ingredientsReducer,
  constructorReducer,
  feedReducer,
  orderReducer
} from '@slices';
import { initialState as userInitialState } from '../slices/userSlice';
import { initialState as ingredientsInitialState } from '../slices/ingredientsSlice';
import { initialState as constructorInitialState } from '../slices/constructorSlice';
import { initialState as feedInitialState } from '../slices/feedSlice';
import { initialState as orderInitialState } from '../slices/orderSlice';

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

  it('Проверка инициализации user слайса с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.user).toEqual(userInitialState);
  });

  it('Проверка инициализации ingredients слайса с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.ingredients).toEqual(ingredientsInitialState);
  });

  it('Проверка инициализации burgerConstructor слайса с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.burgerConstructor).toEqual(constructorInitialState);
  });

  it('Проверка инициализации feed слайса с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.feed).toEqual(feedInitialState);
  });

  it('Проверка инициализации order слайса с начальным состоянием', () => {
    const store = configureStore({
      reducer: rootReducer
    });

    const state = store.getState();

    expect(state.order).toEqual(orderInitialState);
  });

  it('Проверка начального состояния при передаче undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toBeDefined();
    expect(state.user).toEqual(userInitialState);
    expect(state.ingredients).toEqual(ingredientsInitialState);
    expect(state.burgerConstructor).toEqual(constructorInitialState);
    expect(state.feed).toEqual(feedInitialState);
    expect(state.order).toEqual(orderInitialState);
  });
});
