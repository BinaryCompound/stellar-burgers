import { test, expect } from '@jest/globals';
import {
  burgerConstructorSlice,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  initialState
} from '../slices/burgerContructorSlice';
import { TIngredient } from '@utils-types';

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

const burger = {
  bun: { ...bunIngredient, id: '1' },
  ingredients: [
    { ...mainIngredient, id: '2' },
    { ...sauceIngredient, id: '3' }
  ]
};

describe('проверим слайс burgerConstructor - добавление ингредиента', () => {
  test('проверка добавления булки в заказ', () => {
    const testState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(bunIngredient)
    );
    expect(testState.bun).toEqual(expect.objectContaining(bunIngredient));
  });

  test('проверка добавления основного ингредиента в заказ', () => {
    const testState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(mainIngredient)
    );
    expect(testState.ingredients[0]).toEqual(
      expect.objectContaining(mainIngredient)
    );
  });

  test('проверка добавления соуса в заказ', () => {
    const testState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(sauceIngredient)
    );
    expect(testState.ingredients[0]).toEqual(
      expect.objectContaining(sauceIngredient)
    );
  });

  test('проверим, что изначально конструктор пустой', () => {
    const testState = burgerConstructorSlice.reducer(undefined, { type: '' });
    expect(testState).toEqual(initialState);
  });
});

describe('проверим слайс burgerConstructor - удаление ингредиента', () => {
  test('проверим удаление соуса', () => {
    const testState = burgerConstructorSlice.reducer(
      burger,
      deleteIngredient('3')
    );
    expect(testState.ingredients).toHaveLength(1);
    expect(testState.ingredients).not.toContain(sauceIngredient);
  });

  test('проверим удаление основного ингредиента', () => {
    const testState = burgerConstructorSlice.reducer(
      burger,
      deleteIngredient('2')
    );
    expect(testState.ingredients).toHaveLength(1);
    expect(testState.ingredients).not.toContain(mainIngredient);
  });
});

describe('проверим слайс burgerConstructor - перемещение ингредиента', () => {
  test('проверим перемещение ингредиента с позиции 3 на позицию 2', () => {
    const testState = burgerConstructorSlice.reducer(
      burger,
      moveIngredient({ from: 1, to: 0 })
    );
    expect(testState.ingredients).toEqual([
      burger.ingredients[1],
      burger.ingredients[0]
    ]);
  });
});
