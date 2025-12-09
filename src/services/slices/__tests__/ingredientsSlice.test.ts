import ingredientsReducer, {
  fetchIngredients,
  IngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState: IngredientsState = {
    items: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://example.com/bun.png',
      image_mobile: 'https://example.com/bun-mobile.png',
      image_large: 'https://example.com/bun-large.png'
    },
    {
      _id: '2',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://example.com/main.png',
      image_mobile: 'https://example.com/main-mobile.png',
      image_large: 'https://example.com/main-large.png'
    }
  ];

  describe('Начального состояния', () => {
    it('Проверка возврата начального состояния', () => {
      const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

      expect(state).toEqual(initialState);
    });
  });

  describe('fetchIngredients.pending', () => {
    it('Установка isLoading в true при отправке запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('Сброс предыдущей ошибки при новом запросе', () => {
      const stateWithError: IngredientsState = {
        items: [],
        isLoading: false,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('Сохранение ингредиентов и установка isLoading в false', () => {
      const loadingState: IngredientsState = {
        items: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.items).toHaveLength(2);
      expect(state.error).toBeNull();
    });

    it('Замена существующих ингредиентов новыми', () => {
      const stateWithData: IngredientsState = {
        items: [mockIngredients[0]],
        isLoading: true,
        error: null
      };

      const newIngredients = [mockIngredients[1]];
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: newIngredients
      };
      const state = ingredientsReducer(stateWithData, action);

      expect(state.items).toEqual(newIngredients);
      expect(state.items).toHaveLength(1);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('Сохранение ошибки и установка isLoading в false', () => {
      const loadingState: IngredientsState = {
        items: [],
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      };
      const state = ingredientsReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.items).toHaveLength(0);
    });

    it('Сохранение существующих данных при ошибке', () => {
      const stateWithData: IngredientsState = {
        items: mockIngredients,
        isLoading: true,
        error: null
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Server error' }
      };
      const state = ingredientsReducer(stateWithData, action);

      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBe('Server error');
    });
  });
});




