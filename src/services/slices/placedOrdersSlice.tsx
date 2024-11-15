import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'; // Импортируем функции для создания асинхронных действий и слайсов
import { getOrdersApi } from '../../utils/burger-api'; // Импортируем API для получения списка заказов
import { TOrder } from '@utils-types'; // Импортируем тип данных для заказа

// Описание структуры состояния слайса
export type TPlacedOrdersSlice = {
  error: string | null; // Ошибка при загрузке заказов
  isLoading: boolean; // Статус загрузки
  orders: TOrder[]; // Массив заказов
};

// Начальное состояние слайса
export const initialState: TPlacedOrdersSlice = {
  error: null, // Нет ошибки при загрузке заказов
  isLoading: false, // Загрузка заказов не начата
  orders: [] // Изначально нет заказов
};

// Создаём асинхронное действие для получения заказов
export const getPlacedOrders = createAsyncThunk(
  'placedOrders/get',
  async () => getOrdersApi() // Запрос на получение списка заказов
);

// Создаём слайс для управления состоянием размещенных заказов
export const placedOrdersSlice = createSlice({
  name: 'placedOrders', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Нет редукторов, только обработка асинхронных действий
  extraReducers: (builder) => {
    // Обработка асинхронных действий через `extraReducers`
    builder
      .addCase(getPlacedOrders.rejected, (state, action) => {
        // Когда запрос на получение заказов завершился с ошибкой
        state.isLoading = false; // Снимаем флаг загрузки
        state.error = 'Oшибка загрузки заказов'; // Устанавливаем ошибку
      })
      .addCase(getPlacedOrders.pending, (state) => {
        // Когда запрос на получение заказов находится в процессе
        state.isLoading = true; // Устанавливаем флаг загрузки
        state.orders = []; // Очищаем список заказов до получения данных
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(getPlacedOrders.fulfilled, (state, action) => {
        // Когда заказ успешно загружен
        state.isLoading = false; // Снимаем флаг загрузки
        state.orders = action.payload; // Обновляем список заказов
      });
  },
  selectors: {
    // Селектор для получения списка заказов
    selectPlacedOrders: (state) => state.orders
  }
});

// Экспортируем селектор для использования в компонентах
export const { selectPlacedOrders } = placedOrdersSlice.selectors;

// Экспортируем редуктор для добавления его в rootReducer
export default placedOrdersSlice.reducer;
