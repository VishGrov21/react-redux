import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v1 as uuid } from 'uuid';
import { Todo } from '../type';
import logger from 'redux-logger';

const TodosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: TodosInitialState,
  reducers: {
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      //   In convention the state shouldn't be updated but because of Immer Library
      //   which is part of core reduxjs tookit
      //   we can mutate the state and Immer will take care of it in redux toolkit library
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) state[index].desc = payload.desc;
    },
    toggle: (state, { payload }: PayloadAction<{ id: string; isComplete: boolean }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) state[index].isComplete = payload.isComplete;
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index > -1) state.splice(index, 1);
    },
    create: {
      //   As in CreateSlice you cannot create action creators
      //   so we need to prepare the payload before it reaches to the reducer

      // desc is extracted from the payload
      prepare: ({ desc }: { desc: string }) => ({
        // prepare returns an object with payload as key
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
      reducer: (state, { payload }: PayloadAction<Todo>) => {
        state.push(payload);
      },
    },
  },
});

const selectTodoSlice = createSlice({
  name: 'selectTodo',
  initialState: null as String | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => {
      return payload.id;
    },
  },
});

const counter = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
  },
});

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectTodoSlice.reducer,
  counter: counter.reducer,
};

// const middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(logger);

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const {type} = todosSlice.actions.create
console.log("🚀 ~ file: redux-toolkit.ts ~ line 106 ~ type", type)

export const { select: selectTodoActionCreator } = selectTodoSlice.actions;
