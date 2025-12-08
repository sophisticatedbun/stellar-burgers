export {
  default as userReducer,
  setAuthChecked,
  setUser,
  clearUser,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  checkUserAuth
} from './userSlice';
export type { UserState } from './userSlice';

export {
  default as ingredientsReducer,
  fetchIngredients
} from './ingredientsSlice';
export type { IngredientsState } from './ingredientsSlice';

export {
  default as constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
export type { ConstructorState } from './constructorSlice';

export { default as feedReducer, fetchFeed } from './feedSlice';
export type { FeedState } from './feedSlice';

export {
  default as orderReducer,
  createOrder,
  fetchOrderByNumber,
  fetchUserOrders,
  clearOrderModalData
} from './orderSlice';
export type { OrderState } from './orderSlice';
