import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // Импортируем функции для работы с асинхронными действиями и слайсами
import {
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '../../utils/burger-api'; // Импортируем API-функции для регистрации, логина, выхода и обновления данных пользователя
import { TUser } from '@utils-types'; // Импортируем тип данных для пользователя
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie'; // Импортируем утилиты для работы с куки

// Тип состояния для слайса пользователя
export interface IUserSlice {
  isLoading: boolean; // Флаг, показывающий, загружается ли состояние пользователя
  error: string | null; // Ошибка при работе с пользователем
  user: TUser | null; // Данные пользователя
  isAuthChecked: boolean; // Флаг, показывающий, проверена ли авторизация
}

// Начальное состояние слайса
export const initialState: IUserSlice = {
  isLoading: false, // Изначально данные пользователя не загружаются
  error: null, // Ошибки нет
  user: null, // Нет данных о пользователе
  isAuthChecked: false // Авторизация еще не проверена
};

// Асинхронное действие для получения данных пользователя
export const getUser = createAsyncThunk('user/get', async () => getUserApi());

// Асинхронное действие для проверки авторизации пользователя
export const checkUser = createAsyncThunk('user/check', (_, { dispatch }) => {
  if (getCookie('accessToken')) {
    // Если есть токен доступа в cookies
    dispatch(getUser()).finally(() => {
      dispatch(authChecked()); // После проверки авторизации вызываем действие authChecked
    });
  } else {
    dispatch(authChecked()); // Если токена нет, сразу вызываем authChecked
  }
});

// Асинхронное действие для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

// Асинхронное действие для регистрации нового пользователя
export const userRegister = createAsyncThunk(
  'user/register',
  async ({ email, name, password }: TRegisterData, { rejectWithValue }) => {
    const data = await registerUserApi({ email, name, password });
    if (!data?.success) {
      return rejectWithValue(data); // Если регистрация не удалась, возвращаем ошибку
    }
    setCookie('accessToken', data.accessToken); // Сохраняем токен доступа в cookies
    localStorage.setItem('refreshToken', data.refreshToken); // Сохраняем refreshToken в localStorage
    return data; // Возвращаем данные
  }
);

// Асинхронное действие для авторизации пользователя
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return rejectWithValue(data); // Если логин не удался, возвращаем ошибку
    }
    setCookie('accessToken', data.accessToken); // Сохраняем токен доступа в cookies
    localStorage.setItem('refreshToken', data.refreshToken); // Сохраняем refreshToken в localStorage
    return data.user; // Возвращаем данные пользователя
  }
);

// Асинхронное действие для выхода пользователя
export const userLogout = createAsyncThunk('user/logout', async () => {
  logoutApi().then(() => {
    deleteCookie('accessToken'); // Удаляем токен доступа из cookies
    localStorage.clear(); // Очищаем localStorage
  });
});

// Создание слайса для управления состоянием пользователя
export const userSlice = createSlice({
  name: 'user', // Имя слайса
  initialState, // Начальное состояние
  selectors: {
    selectUser: (state) => state // Селектор для получения данных о пользователе
  },
  reducers: {
    // Редуктор для установки флага, что авторизация была проверена
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    // Обработка состояний для различных асинхронных действий
    builder
      // Для getUser (получение данных пользователя)
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false; // Снимаем флаг загрузки
        state.error = 'загрузка пользователя не удалась'; // Устанавливаем ошибку
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Устанавливаем данные пользователя
        state.isLoading = false; // Снимаем флаг загрузки
        state.isAuthChecked = true; // Авторизация проверена
      })
      // Для checkUser (проверка авторизации)
      .addCase(checkUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.error = 'пользователь не зарегистрирован'; // Ошибка авторизации
      })
      .addCase(checkUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(checkUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true; // Авторизация проверена
      })
      // Для updateUser (обновление данных пользователя)
      .addCase(updateUser.rejected, (state) => {
        state.isLoading = false;
        state.error = 'обновление пользователя неудалось'; // Ошибка при обновлении
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Обновляем данные пользователя
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      // Для userRegister (регистрация пользователя)
      .addCase(userRegister.rejected, (state) => {
        state.isLoading = false;
        state.error = 'регистрация не удалась'; // Ошибка при регистрации
      })
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user; // Устанавливаем данные пользователя
      })
      // Для userLogin (вход пользователя)
      .addCase(userLogin.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = false;
        state.error = 'вход не удался'; // Ошибка при входе
      })
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true; // Авторизация успешна
        state.user = action.payload; // Устанавливаем данные пользователя
      })
      // Для userLogout (выход пользователя)
      .addCase(userLogout.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = 'выход не удался'; // Ошибка при выходе
      })
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null; // Очищаем данные пользователя
      });
  }
});

// Экспортируем действия и селектор
export const { authChecked } = userSlice.actions;
export const { selectUser } = userSlice.selectors;

// Экспортируем редуктор для добавления в rootReducer
export default userSlice.reducer;
