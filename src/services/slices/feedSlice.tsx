import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // Импортируем необходимые функции для создания асинхронных действий и слайсов
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api'; // Импортируем API для получения данных
import { TOrder } from '../../utils/types'; // Импортируем тип данных для заказов

// Создаём асинхронное действие для получения ленты заказов
export const getFeeds = createAsyncThunk('orders/get', async () => {
  // Запрос к API для получения данных ленты
  const fetchFeed = getFeedsApi(); // Асинхронный вызов API
  return fetchFeed; // Возвращаем данные после выполнения запроса
});

// Описание структуры состояния слайса
export type TFeedSlice = {
  orders: TOrder[]; // Массив заказов
  isLoading: boolean; // Статус загрузки данных
  error: string | null; // Ошибка при запросе (если есть)
  feed: {
    total: number; // Общее количество заказов
    totalToday: number; // Количество заказов сегодня
  };
};

// Начальное состояние слайса
export const initialState: TFeedSlice = {
  orders: [], // Изначально нет заказов
  isLoading: false, // Загрузка данных не начата
  error: null, // Нет ошибки
  feed: {
    total: 0, // Изначально 0 заказов
    totalToday: 0 // Изначально 0 заказов за сегодня
  }
};

// Создаём слайс для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Здесь не определены дополнительные редукторы
  extraReducers: (builder) => {
    // Обработка асинхронных действий через `extraReducers`
    builder
      .addCase(getFeeds.pending, (state) => {
        // Когда запрос находится в процессе выполнения
        state.isLoading = true; // Устанавливаем флаг загрузки в true
        state.error = null; // Сбрасываем ошибку, если она была
      })
      .addCase(getFeeds.rejected, (state, action) => {
        // Когда запрос завершился с ошибкой
        state.isLoading = false; // Снимаем флаг загрузки
        state.error = 'Ошибка загрузки ленты'; // Устанавливаем текст ошибки
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        // Когда запрос завершился успешно
        state.isLoading = false; // Снимаем флаг загрузки
        state.orders = action.payload.orders; // Обновляем список заказов
        state.feed.total = action.payload.total; // Обновляем общее количество заказов
        state.feed.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
      });
  },
  // Определение селекторов для получения состояния из слайса
  selectors: {
    selectOrders: (state) => state.orders, // Селектор для получения всех заказов
    selectFeed: (state) => state.feed // Селектор для получения информации о ленте (общее количество заказов, заказы сегодня)
  }
});

// Экспортируем селекторы для использования в компонентах
export const { selectOrders, selectFeed } = feedSlice.selectors;

// Экспортируем имя слайса (не обязательно, но может быть полезно)
export const feedSliceName = feedSlice.name;

// Экспортируем редуктор для добавления его в rootReducer
export default feedSlice.reducer;
