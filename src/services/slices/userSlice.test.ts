import { expect, test } from '@jest/globals';
import {
  initialState,
  getUser,
  userLogout,
  userLogin,
  userSlice,
  userRegister,
  updateUser,
  IUserSlice,
  checkUser
} from '../slices/userSlice';
import {
  TLoginData,
  TRegisterData,
  TUserResponse
} from '../../utils/burger-api';

describe('проверим слайс userSlice', () => {
  beforeAll(() => {
    global.localStorage = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    };
  });

  jest.mock('../../utils/cookie', () => ({
    setCookie: jest.fn(),
    getCookie: jest.fn(),
    deleteCookie: jest.fn()
  }));

  afterAll(() => {
    jest.clearAllMocks();
  });

  const mockUserResponse: TUserResponse = {
    success: true,
    user: {
      email: 'MammaMia@yandex.ru',
      name: 'Donna'
    }
  };

  // userLogout
  test('проверим userLogout.pending', () => {
    const action = {
      type: userLogout.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим userLogout.fulfilled', () => {
    const action = {
      type: userLogout.fulfilled.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = initialState;

    expect(testState).toEqual(checkState);
  });

  test('проверим userLogout.rejected', () => {
    const action = {
      type: userLogout.rejected.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      isAuthChecked: true,
      error: 'выход не удался'
    };

    expect(testState).toEqual(checkState);
  });

  // userLogin
  test('проверим userLogin.pending', () => {
    const action = {
      type: userLogin.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим userLogin.fulfilled', () => {
    const action = {
      type: userLogin.fulfilled.type,
      payload: mockUserResponse.user
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      user: mockUserResponse.user,
      isAuthChecked: true
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим userLogin.rejected', () => {
    const action = {
      type: userLogin.rejected.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, error: 'вход не удался' };

    expect(testState).toEqual(checkState);
  });

  // userRegister
  test('проверим userRegister.pending', () => {
    const action = {
      type: userRegister.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим userRegister.fulfilled', () => {
    const action = {
      type: userRegister.fulfilled.type,
      payload: mockUserResponse
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      user: mockUserResponse.user
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим userRegister.rejected', () => {
    const action = {
      type: userRegister.rejected.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      error: 'регистрация не удалась'
    };

    expect(testState).toEqual(checkState);
  });

  // updateUser
  test('проверим updateUser.pending', () => {
    const action = {
      type: updateUser.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: mockUserResponse
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      user: mockUserResponse.user
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      error: 'обновление пользователя неудалось'
    };

    expect(testState).toEqual(checkState);
  });

  // checkUser
  test('проверим checkUser.pending', () => {
    const action = {
      type: checkUser.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим checkUser.fulfilled', () => {
    const action = {
      type: checkUser.fulfilled.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isAuthChecked: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим checkUser.rejected', () => {
    const action = {
      type: checkUser.rejected.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      isAuthChecked: false,
      error: 'пользователь не зарегистрирован'
    };

    expect(testState).toEqual(checkState);
  });

  // getUser
  test('проверим getUser.pending', () => {
    const action = {
      type: getUser.pending.type
    };
    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = { ...initialState, isLoading: true };

    expect(testState).toEqual(checkState);
  });

  test('проверим getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUserResponse
    };

    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      user: mockUserResponse.user,
      isAuthChecked: true
    };

    expect(testState).toEqual(checkState);
  });

  test('проверим getUser.rejected', () => {
    const action = {
      type: getUser.rejected.type
    };

    const testState = userSlice.reducer(initialState, action);
    const checkState: IUserSlice = {
      ...initialState,
      error: 'загрузка пользователя не удалась'
    };

    expect(testState).toEqual(checkState);
  });
});
