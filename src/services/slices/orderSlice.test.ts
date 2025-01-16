import { expect, test } from '@jest/globals';
import { TOrderResponse, TNewOrderResponse } from '../../utils/burger-api';
import {
  fetchOrderByNumber,
  orderSlice,
  initialState,
  TOrderSlice,
  postOrder
} from '../slices/orderSlice';

const mockOrderResponse: TOrderResponse = {
  success: true,
  orders: [
    {
      _id: '66ed7358119d45001b507ef4',
      status: 'done',
      name: 'Флюоресцентный люминесцентный бургер',
      createdAt: '2024-09-20T13:06:32.642Z',
      updatedAt: '2024-09-20T13:06:33.485Z',
      number: 53445,
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
    },
    {
      _id: '66ed6ad7119d45001b507edb',
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2024-09-20T12:29:48.229Z',
      updatedAt: '2024-09-20T12:29:48.709Z',
      number: 53442,
      ingredients: ['643d69a5c3f7b9001cfa093c']
    }
  ]
};

const mockOrderToPostResponse: TNewOrderResponse = {
  success: true,
  order: {
    _id: '66ed7358119d45001b507ef4',
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-09-20T13:06:32.642Z',
    updatedAt: '2024-09-20T13:06:33.485Z',
    number: 53445,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
  },
  name: 'Evgeniya'
};

describe('проверим слайс orderSlice', () => {

  test('проверим postOrder.rejected', () => {
    const action = {
      type: postOrder.rejected.type
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = {
      ...initialState,
      postOrderError: 'Ошибка размещения заказа'
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим postOrder.fulfilled', () => {
    const action = {
      type: postOrder.fulfilled.type,
      payload: mockOrderToPostResponse
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = {
      ...initialState,
      orderData: mockOrderToPostResponse.order
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим postOrder.pending', () => {
    const action = {
      type: postOrder.pending.type
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = { ...initialState, orderRequest: true };
    expect(testState).toEqual(checkState);
  });

  test('проверим fetchOrderByNumber.rejected', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = {
      ...initialState,
      fetchOrderByIdError: 'Ошибка загрузки заказа'
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим fetchOrderByNumber.fulfilled', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrderResponse
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = {
      ...initialState,
      orderData: mockOrderResponse.orders[0]
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим fetchOrderByNumber.pending', () => {
    const action = {
      type: fetchOrderByNumber.pending.type
    };
    const testState = orderSlice.reducer(initialState, action);
    const checkState: TOrderSlice = { ...initialState, isLoading: true };
    expect(testState).toEqual(checkState);
  });
});
