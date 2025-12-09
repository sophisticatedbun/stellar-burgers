import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('constructorSlice', () => {
  const initialState: ConstructorState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: 'bun-1',
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
  };

  const mockMain: TIngredient = {
    _id: 'main-1',
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
  };

  const mockSauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_mobile: 'https://example.com/sauce-mobile.png',
    image_large: 'https://example.com/sauce-large.png'
  };

  describe('Начальное состояние', () => {
    it('Проверка вовзрата начального состояния', () => {
      const state = constructorReducer(undefined, { type: 'UNKNOWN' });

      expect(state).toEqual(initialState);
    });
  });

  describe('addIngredient', () => {
    it('Добавление булки в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).not.toBeNull();
      expect(state.bun?._id).toBe('bun-1');
      expect(state.bun?.name).toBe('Краторная булка N-200i');
      expect(state.bun?.id).toBe('test-uuid-123');
    });

    it('Замена булку при добавлении новой', () => {
      const anotherBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Флюоресцентная булка R2-D3'
      };

      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(anotherBun));

      expect(state.bun?._id).toBe('bun-2');
      expect(state.bun?.name).toBe('Флюоресцентная булка R2-D3');
    });

    it('Добавление начинки в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('main-1');
      expect(state.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
      expect(state.ingredients[0].id).toBe('test-uuid-123');
    });

    it('Добавление соуса в конструктор', () => {
      const state = constructorReducer(initialState, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('sauce-1');
      expect(state.ingredients[0].type).toBe('sauce');
    });

    it('Добавление нескольких ингредиентов', () => {
      let state = constructorReducer(initialState, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.ingredients).toHaveLength(2);
      expect(state.bun).toBeNull();
    });
  });

  describe('removeIngredient', () => {
    it('Удаление ингредиента из конструктора', () => {
      const stateWithIngredient: ConstructorState = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'ingredient-to-remove' } as TConstructorIngredient
        ]
      };

      const state = constructorReducer(
        stateWithIngredient,
        removeIngredient('ingredient-to-remove')
      );

      expect(state.ingredients).toHaveLength(0);
    });

    it('Удаление только указанного ингредиента', () => {
      const stateWithIngredients: ConstructorState = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'keep-1' } as TConstructorIngredient,
          { ...mockSauce, id: 'remove-this' } as TConstructorIngredient,
          { ...mockMain, id: 'keep-2' } as TConstructorIngredient
        ]
      };

      const state = constructorReducer(
        stateWithIngredients,
        removeIngredient('remove-this')
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients.find((i) => i.id === 'remove-this')).toBeUndefined();
      expect(state.ingredients.find((i) => i.id === 'keep-1')).toBeDefined();
      expect(state.ingredients.find((i) => i.id === 'keep-2')).toBeDefined();
    });
  });

  describe('moveIngredient', () => {
    it('Перемещение ингредиента', () => {
      const stateWithIngredients: ConstructorState = {
        bun: null,
        ingredients: [
          { ...mockMain, id: 'id-1', name: 'Первый' } as TConstructorIngredient,
          { ...mockSauce, id: 'id-2', name: 'Второй' } as TConstructorIngredient,
          { ...mockMain, id: 'id-3', name: 'Третий' } as TConstructorIngredient
        ]
      };

      const state = constructorReducer(
        stateWithIngredients,
        moveIngredient({ from: 0, to: 2 })
      );

      expect(state.ingredients[0].name).toBe('Второй');
      expect(state.ingredients[1].name).toBe('Третий');
      expect(state.ingredients[2].name).toBe('Первый');
    });
  });

  describe('clearConstructor', () => {
    it('Очистка конструктора', () => {
      const stateWithData: ConstructorState = {
        bun: { ...mockBun, id: 'bun-uuid' } as TConstructorIngredient,
        ingredients: [
          { ...mockMain, id: 'main-uuid' } as TConstructorIngredient,
          { ...mockSauce, id: 'sauce-uuid' } as TConstructorIngredient
        ]
      };

      const state = constructorReducer(stateWithData, clearConstructor());

      expect(state).toEqual(initialState);
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});




