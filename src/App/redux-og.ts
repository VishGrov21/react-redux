import { Todo } from '../type';
import { v1 as uuid } from 'uuid';
import { applyMiddleware, combineReducers, createStore } from 'redux';
// import thunk from 'redux-thunk';
// import logger from 'redux-logger';
// import { composeWithDevTools } from 'redux-devtools-extension';

// constants
const CREATE_TODO = 'CREATE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SELECT_TODO = 'SELECT_TODO';

// Actions and Action-type
interface CreateTodoActionType {
  type: typeof CREATE_TODO;
  payload: Todo;
}

export const createTodoActionCreator = ({ desc }: { desc: string }): CreateTodoActionType => {
  return {
    type: CREATE_TODO,
    payload: {
      id: uuid(),
      desc: desc,
      isComplete: false,
    },
  };
};

interface EditTodoActionType {
  type: typeof EDIT_TODO;
  payload: { id: string; desc: string };
}

export const editTodoActionCreator = ({
  id,
  desc,
}: {
  id: string;
  desc: string;
}): EditTodoActionType => {
  return {
    type: EDIT_TODO,
    payload: {
      id,
      desc,
    },
  };
};

interface ToggleTodoActionType {
  type: typeof TOGGLE_TODO;
  payload: { id: string; isComplete: boolean };
}

export const toggleTodoActionCreator = ({
  id,
  isComplete,
}: {
  id: string;
  isComplete: boolean;
}): ToggleTodoActionType => {
  return {
    type: TOGGLE_TODO,
    payload: { id, isComplete },
  };
};
interface DeleteTodoActionType {
  type: typeof DELETE_TODO;
  payload: { id: string };
}

export const deleteTodoActionCreator = ({ id }: { id: string }): DeleteTodoActionType => {
  return {
    type: DELETE_TODO,
    payload: { id },
  };
};

interface SelectTodoActionType {
  type: typeof SELECT_TODO;
  payload: { id: string };
}

export const selectTodoActionCreator = ({ id }: { id: string }): SelectTodoActionType => {
  return {
    type: SELECT_TODO,
    payload: { id },
  };
};

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

// Reducers
type TodoActionTypes =
  | CreateTodoActionType
  | EditTodoActionType
  | DeleteTodoActionType
  | ToggleTodoActionType;
const todoReducer = (state: Todo[] = TodosInitialState, action: TodoActionTypes) => {
  switch (action.type) {
    case CREATE_TODO: {
      const { payload } = action;
      return [...state, payload];
    }
    case EDIT_TODO: {
      const { payload } = action;
      return state.map((item, index) =>
        item.id === payload.id ? { ...item, desc: payload.desc } : item,
      );
    }
    case TOGGLE_TODO: {
      const { payload } = action;
      return state.map((item) =>
        item.id === payload.id ? { ...item, isComplete: payload.isComplete } : item,
      );
    }
    case DELETE_TODO: {
      const { payload } = action;
      return state.filter((item) => item.id !== payload.id);
    }
    default:
      return state;
  }
};

const selectTodoReducer = (state: string | null = null, action: SelectTodoActionType) => {
  const { type, payload } = action;
  switch (type) {
    case SELECT_TODO:
      return payload.id;
    default:
      return state;
  }
};

const counterReducer = (state: number = 0, action: TodoActionTypes) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_TODO:
    case EDIT_TODO:
    case TOGGLE_TODO:
    case DELETE_TODO:
      return state + 1;
    default:
      return state;
  }
};

const reducers = combineReducers({
  todos: todoReducer,
  selectedTodo: selectTodoReducer,
  counter: counterReducer,
});

// store

// export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk, logger)));
