import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'; // Импортируем необходимые функции для создания асинхронных действий и слайсов
import { getIngredientsApi } from '../../utils/burger-api'; // Импортируем API для получения списка ингредиентов
import { TIngredient } from '@utils-types'; // Импортируем тип данных для ингредиента

// Описание структуры состояния слайса
export type TIngredientsSlice = {
  ingredients: TIngredient[]; // Массив всех ингредиентов
  isLoading: boolean; // Статус загрузки данных
  error: string | null; // Ошибка при запросе (если есть)
};

// Начальное состояние слайса
export const initialState: TIngredientsSlice = {
  ingredients: [], // Изначально нет ингредиентов
  isLoading: false, // Загрузка данных не начата
  error: null // Нет ошибки
};

// Создаём асинхронное действие для получения списка ингредиентов
export const getIngredients = createAsyncThunk(
  'ingredients/get',
  async () => getIngredientsApi() // Выполняем асинхронный запрос к API для получения ингредиентов
);

// Создаём слайс для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'selectIngredients', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Здесь не определены дополнительные редукторы
  extraReducers: (builder) => {
    // Обработка асинхронных действий через `extraReducers`
    builder
      .addCase(getIngredients.pending, (state) => {
        // Когда запрос находится в процессе выполнения
        state.isLoading = true; // Устанавливаем флаг загрузки в true
        state.error = null; // Сбрасываем ошибку, если она была
      })
      .addCase(getIngredients.rejected, (state, action) => {
        // Когда запрос завершился с ошибкой
        state.isLoading = false; // Снимаем флаг загрузки
        state.error = 'ingredients loading error'; // Устанавливаем текст ошибки
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        // Когда запрос завершился успешно
        state.isLoading = false; // Снимаем флаг загрузки
        state.ingredients = action.payload; // Обновляем список ингредиентов
      });
  },
  // Определение селекторов для получения состояния из слайса
  selectors: {
    selectIsLoading: (state) => state.isLoading, // Селектор для получения статуса загрузки
    selectIngredients: (state) => state.ingredients, // Селектор для получения всех ингредиентов
    selectSauces: (
      state // Селектор для получения ингредиентов типа "sauce"
    ) => state.ingredients.filter((ingredient) => ingredient.type === 'sauce'),
    selectMains: (
      state // Селектор для получения ингредиентов типа "main"
    ) => state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    selectBuns: (
      state // Селектор для получения ингредиентов типа "bun"
    ) => state.ingredients.filter((ingredient) => ingredient.type === 'bun')
  }
});

// Экспортируем селекторы для использования в компонентах
export const {
  selectIsLoading,
  selectIngredients,
  selectSauces,
  selectMains,
  selectBuns
} = ingredientsSlice.selectors;

// Экспортируем редуктор для добавления его в rootReducer
export default ingredientsSlice.reducer;
