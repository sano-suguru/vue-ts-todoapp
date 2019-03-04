import { TodoItem } from '@/types/todoItem';

const STORAGE_KEY = 'todos-vue-demo';
const TodoStorage = {
  fetch() {
    const todos: TodoItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]',
    );
    todos.forEach((todo, index) => {
      todo.id = index;
    });
    TodoStorage.uid = todos.length;
    return todos;
  },
  save(todos: TodoItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
  uid: 0,
};
export default TodoStorage;
