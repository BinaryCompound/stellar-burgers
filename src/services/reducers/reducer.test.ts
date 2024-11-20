import { expect, test } from '@jest/globals';
import { rootReducer } from '../reducers/root-reducer';
import { store } from '../store';

describe('проверим правильность настройки и работы root-reducer_а', () => {
  // Тестируем редуктор с неизвестным действием
  const testState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

  test('проверим, что возвращает состояние по умолчанию', () => {
    // Ожидаем, что результат работы редуктора будет соответствовать состоянию из хранилища
    expect(testState).toEqual(store.getState());
  });
});
