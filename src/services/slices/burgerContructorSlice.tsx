import { createSlice, PayloadAction } from '@reduxjs/toolkit'; // Импортируем необходимые функции из Redux Toolkit
import { TConstructorIngredient, TIngredient } from '../../utils/types'; // Импортируем типы для ингредиентов
import { nanoid } from '@reduxjs/toolkit'; // Импортируем функцию для генерации уникальных ID

// Описание структуры состояния слайса
export type TBurgerConstructorSlice = {
  ingredients: TConstructorIngredient[]; // Массив для хранения ингредиентов (кроме булки)
  bun: TConstructorIngredient | TIngredient | null; // Булка для бургера, может быть null на старте
};

// Начальное состояние слайса для конструктора бургера
export const initialState: TBurgerConstructorSlice = {
  ingredients: [], // Изначально нет ингредиентов
  bun: null // Изначально нет булки
};

// Создаём слайс для управления состоянием конструктора бургера
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor', // Имя слайса
  initialState, // Начальное состояние, определённое выше
  reducers: {
    // Редуктор для добавления ингредиента в конструктор бургера
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        // Если ингредиент - это булка, то устанавливаем её в соответствующее поле
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          // Если это обычный ингредиент (не булка), добавляем его в список ингредиентов
          state.ingredients.push(action.payload);
        }
      },
      // Подготовка ингредиента перед отправкой в редуктор
      prepare: (ingredient: TIngredient) => {
        const id = nanoid(); // Генерация уникального ID для ингредиента
        return { payload: { ...ingredient, id } }; // Возвращаем подготовленный объект с новым ID
      }
    },
    // Редуктор для удаления ингредиента
    deleteIngredient: (state, action) => {
      // Фильтруем список ингредиентов, удаляя тот, чьё ID совпадает с переданным в action.payload
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    // Редуктор для перемещения ингредиента внутри списка
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      // Копируем массив ингредиентов для безопасного изменения
      const ingredients = [...state.ingredients];
      // Перемещаем ингредиент с позиции `from` на позицию `to`
      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      // Обновляем список ингредиентов
      state.ingredients = ingredients;
    },
    // Редуктор для очистки конструктора
    emptyConstructor: (state) => {
      // Сбрасываем состояние конструктора, удаляя булку и все ингредиенты
      state.bun = null;
      state.ingredients = [];
    }
  },
  // Определение селекторов для получения состояния (если нужно)
  selectors: {
    selectConstructorItem: (state) => state
  }
});

// Экспортируем действия (actions) для использования в компонентах
export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  emptyConstructor
} = burgerConstructorSlice.actions;

// Экспортируем селектор для получения состояния конструктора
export const { selectConstructorItem } = burgerConstructorSlice.selectors;

// Экспортируем редуктор для добавления его в rootReducer
export const burgerConstructorReducer = burgerConstructorSlice.reducer;
