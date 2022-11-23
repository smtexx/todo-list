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

type UnregisteredTodo = Omit<Todo, 'id'>;

enum GlobalIDs {
  TODOS_UL_ID = 'todo-list',
  USERS_SELECT_ID = 'user-select',
  TODO_FORM_ID = 'todo-form',
  INPUT_FIELD = 'new-todo',
}

(function () {
  // Global stores
  let todosStore: Todo[] = [];
  let usersStore: User[] = [];

  // Global objects
  const todoList = document.getElementById(GlobalIDs.TODOS_UL_ID);
  const userSelect = document.getElementById(GlobalIDs.USERS_SELECT_ID);
  const todoForm = document.getElementById(GlobalIDs.TODO_FORM_ID);
  const inputField = document.getElementById(GlobalIDs.INPUT_FIELD);

  // Init App
  document.addEventListener('DOMContentLoaded', initApp);

  async function initApp() {
    try {
      // Add submit listener to form
      if (todoForm) {
        todoForm.addEventListener('submit', handleFormSubmit);
      } else {
        throw new Error(`Unable to find todo FORM#${GlobalIDs.TODO_FORM_ID}`);
      }

      // Add click listener to list of todos
      if (todoList) {
        todoList.addEventListener('click', handleClickOnTodo);
      } else {
        throw new Error(`Unable to find todo FORM#${GlobalIDs.TODOS_UL_ID}`);
      }

      // Get and render users and todos
      [usersStore, todosStore] = await Promise.all([getUsers(), getTodos()]);

      usersStore.forEach((user) => renderUserOption(user));
      todosStore.forEach((todo) => renderTodo(todo));
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert(
          'Something is broken! Operation of the application is impossible'
        );
      }
    }
  }
  async function handleFormSubmit(event: SubmitEvent) {
    event.preventDefault();

    try {
      // Get todo from form fields
      const todo = createTodo();
      // Register
      const registeredTodo = await registerTodo(todo);
      // Render
      renderTodo(registeredTodo);
      todosStore.push(registeredTodo);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        alert('Unable to create new TODO, please try later');
      }
    }
  }
  function createTodo(): UnregisteredTodo {
    const newTodo: UnregisteredTodo = {
      userId: 0,
      title: '',
      completed: false,
    };

    if (userSelect instanceof HTMLSelectElement) {
      newTodo.userId = Number(userSelect.value);
    } else {
      throw new Error(
        `Unable to get userId from SELECT#${GlobalIDs.USERS_SELECT_ID}`
      );
    }

    if (inputField instanceof HTMLInputElement) {
      newTodo.title = inputField.value;
    } else {
      throw new Error(
        `Unable to get title from INPUT#${GlobalIDs.INPUT_FIELD}`
      );
    }

    return newTodo;
  }
  async function registerTodo(todo: UnregisteredTodo): Promise<Todo> {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Unable to register new todo on server');
    }
  }
  function renderTodo(todo: Todo): void {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = String(todo.id);
    li.innerHTML = `<span>${todo.title} <i>by</i> <b>${getUserName(
      todo.userId
    )}</b></span>`;

    const input = document.createElement('input');
    input.className = 'todo-status';
    input.type = 'checkbox';
    input.checked = todo.completed;

    const close = document.createElement('span');
    close.className = 'todo-close';
    close.textContent = '&times;';

    li.prepend(input);
    li.append(close);

    if (todoList) {
      todoList.prepend(li);
    } else {
      throw new Error(
        `Unable to get UL#${GlobalIDs.TODOS_UL_ID} to insert new TODO`
      );
    }
  }
  function getUserName(userId: number): string {
    const user = usersStore.find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  }
  async function handleClickOnTodo(event: MouseEvent) {
    const element = event.target;
    if (!element || !(element instanceof HTMLElement)) return;

    // Handle change todo status
    if (
      element.classList.contains('todo-status') &&
      element instanceof HTMLInputElement
    ) {
      try {
        const todoId = getParentTodoId(element);
        await changeTodoStatus(todoId, element.checked);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          alert('Unable to change Todo status');
        }
      }
    }

    // Handle todo close
    if (element.classList.contains('todo-close')) {
      try {
        const todoId = getParentTodoId(element);
        await closeTodo(todoId);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          alert('Unable to delete Todo');
        }
      }
    }
  }
  function getParentTodoId(el: HTMLElement): number {
    const id = el.parentElement?.dataset.id;
    const idNumber = Number(id);
    if (!Number.isNaN(idNumber)) {
      return idNumber;
    } else {
      throw new Error(`Unable to extract number from ID ${id}`);
    }
  }
  async function changeTodoStatus(todoId: number, status: boolean) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed: status }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const todo = todosStore.find((t) => t.id === todoId);

    if (todo) {
      if (response.ok) {
        const data: unknown = await response.json();
        todo.completed = status;
      } else {
        const inputElement = todoList?.querySelector(
          `li[data-id=${todoId}] .todo-status`
        );

        if (inputElement instanceof HTMLInputElement) {
          inputElement.checked = todo.completed;
        }

        throw new Error(
          'Unable to synchronize Todo status changing with server'
        );
      }
    } else {
      throw new Error(
        'Can not find Todo to synchronize status in the todosStore'
      );
    }
  }
  async function closeTodo(todoId: number) {
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
      deleteTodo(todoId);
    } else {
      throw new Error(`Can not delete Todo with ID ${todoId}`);
    }
  }
  function deleteTodo(todoId: number) {
    // Delete from todosStore
    todosStore = todosStore.filter((t) => t.id !== todoId);
    // Delete from page
    const todoElement = todoList?.querySelector(`li[data-id=${todoId}]`);
    todoElement?.remove();
  }
  async function getUsers(): Promise<User[]> {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users?_limit=5'
    );

    if (response.ok) {
      const data = await response.json();

      try {
        validateDataArray(
          {
            id: 'number',
            name: 'string',
          },
          data
        );

        return data;
      } catch (error) {
        throw new Error('Invalid format of Users data from server');
      }
    } else {
      throw new Error('Impossible to load Users from server');
    }
  }
  function validateDataArray(
    config: {
      [key: string]: string;
    },
    data: unknown
  ) {
    function validateObject(object: { [key: string]: unknown }) {
      Object.entries(config).forEach(([key, type]) => {
        if (!(key in object) || typeof object[key] !== type) {
          throw new Error('Data does not match the configuration');
        }
      });
    }

    if (Array.isArray(data)) {
      data.forEach((object) => validateObject(object));
    } else {
      throw new Error('Data object is not array');
    }
  }
  async function getTodos() {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=15'
    );

    if (response.ok) {
      const data = await response.json();

      try {
        validateDataArray(
          {
            userId: 'number',
            id: 'number',
            title: 'string',
            completed: 'boolean',
          },
          data
        );

        return data;
      } catch (error) {
        throw new Error('Invalid format of Todos data from server');
      }
    } else {
      throw new Error('Impossible to load Todos from server');
    }
  }
  function renderUserOption(user: User) {
    const option = new Option(user.name, String(user.id));
    userSelect?.append(option);
  }
})();
