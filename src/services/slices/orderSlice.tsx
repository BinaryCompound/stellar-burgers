import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'; // Импортируем необходимые функции для создания асинхронных действий и слайсов
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api'; // Импортируем API для размещения заказа и получения заказа по номеру
import { TOrder } from '../../utils/types'; // Импортируем тип данных для заказа

// Описание структуры состояния слайса
export type TOrderSlice = {
  postOrderError: string | null; // Ошибка при размещении заказа
  fetchOrderByIdError: string | null; // Ошибка при загрузке заказа по номеру
  isLoading: boolean; // Статус загрузки
  orderRequest: boolean; // Статус запроса на создание заказа
  orderData: TOrder | null; // Данные о заказе (если есть)
};

// Начальное состояние слайса
export const initialState: TOrderSlice = {
  postOrderError: null, // Нет ошибки при размещении заказа
  fetchOrderByIdError: null, // Нет ошибки при загрузке заказа
  isLoading: false, // Загрузка данных не начата
  orderRequest: false, // Запрос на создание заказа не в процессе
  orderData: null // Изначально нет данных о заказе
};

// Создаём асинхронное действие для размещения заказа
export const postOrder = createAsyncThunk(
  'order/post', // Имя действия
  async (data: string[]) => {
    const order = await orderBurgerApi(data); // Запрос на создание заказа
    return order; // Возвращаем полученные данные о заказе
  }
);

// Создаём асинхронное действие для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber', // Имя действия
  async (data: number) => {
    const orderData = await getOrderByNumberApi(data); // Запрос на получение заказа по номеру
    return orderData; // Возвращаем данные о заказе
  }
);

// Создаём слайс для управления состоянием заказов
export const orderSlice = createSlice({
  name: 'order', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Редуктор для очистки данных о заказе
    clearOrderData: (state) => {
      state.orderData = null; // Очищаем данные о заказе
    }
  },
  selectors: {
    // Селекторы для получения состояния
    selectOrderRequest: (state) => state.orderRequest, // Селектор для получения статуса запроса на создание заказа
    selectOrderData: (state) => state.orderData // Селектор для получения данных о заказе
  },
  extraReducers: (builder) => {
    // Обработка асинхронных действий через `extraReducers`
    builder
      .addCase(postOrder.rejected, (state, action) => {
        // Когда запрос на создание заказа завершился с ошибкой
        state.isLoading = false; // Снимаем флаг загрузки
        state.postOrderError = 'Ошибка размещения заказа'; // Устанавливаем ошибку
      })
      .addCase(postOrder.pending, (state) => {
        // Когда запрос на создание заказа находится в процессе
        state.orderRequest = true; // Устанавливаем флаг запроса
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        // Когда заказ успешно размещён
        state.orderData = action.payload.order; // Обновляем данные о заказе
        state.orderRequest = false; // Снимаем флаг запроса
        state.isLoading = false; // Снимаем флаг загрузки
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        // Когда запрос на получение заказа по номеру завершился с ошибкой
        state.isLoading = false; // Снимаем флаг загрузки
        state.fetchOrderByIdError = 'Ошибка загрузки заказа'; // Устанавливаем ошибку
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        // Когда запрос на получение заказа находится в процессе
        state.isLoading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        // Когда заказ успешно загружен
        state.isLoading = false; // Снимаем флаг загрузки
        state.orderData = action.payload.orders[0]; // Обновляем данные о заказе
      });
  }
});

// Экспортируем селекторы для использования в компонентах
export const { selectOrderRequest, selectOrderData } = orderSlice.selectors;

// Экспортируем действия
export const { clearOrderData } = orderSlice.actions;

// Экспортируем редуктор для добавления его в rootReducer
export default orderSlice.reducer;
