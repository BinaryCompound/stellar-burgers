import { expect, test } from '@jest/globals';
import { getFeeds, initialState, feedSlice, TFeedSlice } from './feedSlice';
import { TFeedsResponse } from '../../utils/burger-api';

const mockFeedResponse: TFeedsResponse = {
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
    },
    {
      _id: '66ed479f119d45001b507e7f',
      status: 'done',
      name: 'Краторный метеоритный бургер',
      createdAt: '2024-09-20T09:59:59.617Z',
      updatedAt: '2024-09-20T10:00:00.085Z',
      number: 53432,
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0940']
    }
  ],
  total: 7,
  totalToday: 3
};

describe('проверим слайс feedSlice', () => {
  test('проверим getFeeds.fulfilled', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: mockFeedResponse
    };
    const testState = feedSlice.reducer(initialState, action);
    const checkState: TFeedSlice = {
      orders: mockFeedResponse.orders,
      feed: {
        total: mockFeedResponse.total,
        totalToday: mockFeedResponse.totalToday
      },
      isLoading: false,
      error: null
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим getFeeds.rejected', () => {
    const action = {
      type: getFeeds.rejected.type
    };
    const testState = feedSlice.reducer(initialState, action);
    const checkState: TFeedSlice = {
      ...initialState,
      isLoading: false,
      error: 'Ошибка загрузки ленты'
    };
    expect(testState).toEqual(checkState);
  });

  test('проверим getFeeds.pending', () => {
    const action = {
      type: getFeeds.pending.type
    };
    const testState = feedSlice.reducer(initialState, action);
    const checkState = { ...initialState, isLoading: true };
    expect(testState).toEqual(checkState);
  });
});
