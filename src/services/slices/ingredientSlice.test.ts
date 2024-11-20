import { expect, test } from '@jest/globals';
import {
  getIngredients,
  ingredientsSlice,
  initialState,
  TIngredientsSlice
} from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

const bunIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
};

const mainIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const sauceIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png'
};

describe('проверим слайс ingredientsSlice', () => {
  const mockState: TIngredientsSlice = {
    ...initialState,
    ingredients: [mainIngredient, sauceIngredient]
  };

  test('проверим getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: mockState.ingredients
    };

    const testState = ingredientsSlice.reducer(initialState, action);
    const checkState = {
      ingredients: mockState.ingredients,
      isLoading: false,
      error: null
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: 'ingredients loading error'
    };

    const testState = ingredientsSlice.reducer(initialState, action);
    const checkState = {
      ...initialState,
      isLoading: false,
      error: 'ingredients loading error'
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим getIngredients.pending', () => {
    const action = {
      type: getIngredients.pending.type
    };
    const testState = ingredientsSlice.reducer(initialState, action);

    const checkState = { ...initialState, isLoading: true, error: null };
    expect(testState).toEqual(checkState);
  });
});
