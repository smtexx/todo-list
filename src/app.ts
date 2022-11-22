interface User {
  id: number;
  name: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

(function () {
  // Globals
  const todoList = document.getElementById('todo-list');
  const userSelect = document.getElementById('user-select');
  const form = document.querySelector('form');
  let todos: Todo[] = [];
  let users: User[] = [];

  // Init App
  document.addEventListener('DOMContentLoaded', initApp);

  // Basic Logic
  function getUserName(userId: number): string {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : '';
  }

  function printTodo({ id, userId, title, completed }: Todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = String(id);
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleTodoChange);

    const close = document.createElement('span');
    close.innerHTML = '&times;';
    close.className = 'close';
    close.addEventListener('click', handleClose);

    li.prepend(status);
    li.append(close);

    if (todoList) {
      todoList.prepend(li);
    }
  }

  function createUserOption(user: User) {
    const option = document.createElement('option');
    option.value = String(user.id);
    option.innerText = user.name;

    if (userSelect) {
      userSelect.append(option);
    }
  }

  function removeTodo(todoId: number) {
    todos = todos.filter((todo) => todo.id !== todoId);

    if (todoList) {
      const todo = todoList.querySelector(`[data-id="${todoId}"]`);
      todo
        ?.querySelector('input')
        ?.removeEventListener('change', handleTodoChange);
      todo
        ?.querySelector('.close')
        ?.removeEventListener('click', handleClose);
      todo?.remove();
    }
  }

  function alertError(error: Error) {
    alert(error.message);
  }

  // Event Logic
  function initApp() {
    form?.addEventListener('submit', handleSubmit);

    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;

      // Отправить в разметку
      todos.forEach((todo) => printTodo(todo));
      users.forEach((user) => createUserOption(user));
      console.log(users);
    });
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    createTodo({
      userId: Number(form?.user.value),
      title: form?.todo.value,
      completed: false,
    });
  }

  function handleTodoChange(this: HTMLInputElement) {
    const todoId = Number(this.parentElement?.dataset.id);
    const completed = this.checked;

    toggleTodoComplete(todoId, completed);
  }

  function handleClose(this: HTMLSpanElement) {
    const todoId = Number(this.parentElement?.dataset.id);
    deleteTodo(todoId);
  }

  // Async logic
  async function getAllTodos() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=15'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        alertError(error);
      }
    }
  }

  async function getAllUsers() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users?_limit=5'
      );
      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        alertError(error);
      }
    }
  }

  async function createTodo(todo: Omit<Todo, 'id'>) {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const newTodo = await response.json();

      printTodo(newTodo);
    } catch (error) {
      if (error instanceof Error) {
        alertError(error);
      }
    }
  }

  async function toggleTodoComplete(
    todoId: number,
    completed: boolean
  ) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to connect with the server! Please try later.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        alertError(error);
      }
    }
  }

  async function deleteTodo(todoId: number) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        removeTodo(todoId);
      } else {
        throw new Error(
          'Failed to connect with the server! Please try later.'
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        alertError(error);
      }
    }
  }
})();
