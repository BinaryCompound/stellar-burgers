import { expect, test } from '@jest/globals';
import {
  placedOrdersSlice,
  initialState,
  TPlacedOrdersSlice,
  getPlacedOrders
} from '../slices/placedOrdersSlice';
import { TOrder } from '../../utils/types';

const mockPlacedOrders: TOrder[] = [
  {
    _id: '66ed6ad7119d45001b507edb',
    status: 'done',
    name: 'Краторный бургер',
    createdAt: '2024-09-20T12:29:48.229Z',
    updatedAt: '2024-09-20T12:29:48.709Z',
    number: 53442,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  },
  {
    _id: '66ed7358119d45001b507ef4',
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-09-20T13:06:32.642Z',
    updatedAt: '2024-09-20T13:06:33.485Z',
    number: 53445,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
  }
];

describe('проверим слайс placedOrderSlice', () => {

  test('проверим getPlacedOrders.rejected', () => {
    const action = {
      type: getPlacedOrders.rejected.type
    };
    const testState = placedOrdersSlice.reducer(initialState, action);
    const checkState: TPlacedOrdersSlice = {
      ...initialState,
      error: 'Oшибка загрузки заказов'
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим getPlacedOrders.fulfilled', () => {
    const action = {
      type: getPlacedOrders.fulfilled.type,
      payload: mockPlacedOrders
    };
    const testState = placedOrdersSlice.reducer(initialState, action);
    const checkState: TPlacedOrdersSlice = {
      ...initialState,
      orders: mockPlacedOrders
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим getPlacedOrders.pending', () => {
    const action = {
      type: getPlacedOrders.pending.type
    };
    const testState = placedOrdersSlice.reducer(initialState, action);
    const checkState: TPlacedOrdersSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });
});
