"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var GlobalIDs;
(function (GlobalIDs) {
    GlobalIDs["TODOS_UL_ID"] = "todo-list";
    GlobalIDs["USERS_SELECT_ID"] = "user-select";
    GlobalIDs["TODO_FORM_ID"] = "todo-form";
    GlobalIDs["INPUT_FIELD"] = "new-todo";
})(GlobalIDs || (GlobalIDs = {}));
(function () {
    // Global stores
    var todosStore = [];
    var usersStore = [];
    // Global objects
    var todoList = document.getElementById(GlobalIDs.TODOS_UL_ID);
    var userSelect = document.getElementById(GlobalIDs.USERS_SELECT_ID);
    var todoForm = document.getElementById(GlobalIDs.TODO_FORM_ID);
    var inputField = document.getElementById(GlobalIDs.INPUT_FIELD);
    // Init App
    document.addEventListener('DOMContentLoaded', initApp);
    function initApp() {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // Add submit listener to form
                        if (todoForm) {
                            todoForm.addEventListener('submit', handleFormSubmit);
                        }
                        else {
                            throw new Error("Unable to find todo FORM#".concat(GlobalIDs.TODO_FORM_ID));
                        }
                        // Add click listener to list of todos
                        if (todoList) {
                            todoList.addEventListener('click', handleClickOnTodo);
                        }
                        else {
                            throw new Error("Unable to find todo FORM#".concat(GlobalIDs.TODOS_UL_ID));
                        }
                        return [4 /*yield*/, Promise.all([getUsers(), getTodos()])];
                    case 1:
                        // Get and render users and todos
                        _a = _b.sent(), usersStore = _a[0], todosStore = _a[1];
                        usersStore.forEach(function (user) { return renderUserOption(user); });
                        todosStore.forEach(function (todo) { return renderTodo(todo); });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error) {
                            console.error(error_1);
                            alert('Something is broken! Operation of the application is impossible');
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function handleFormSubmit(event) {
        return __awaiter(this, void 0, void 0, function () {
            var todo, registeredTodo, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        todo = createTodo();
                        return [4 /*yield*/, registerTodo(todo)];
                    case 2:
                        registeredTodo = _a.sent();
                        // Render
                        renderTodo(registeredTodo);
                        todosStore.push(registeredTodo);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error) {
                            console.error(error_2);
                            alert('Unable to create new TODO, please try later');
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function createTodo() {
        var newTodo = {
            userId: 0,
            title: '',
            completed: false,
        };
        if (userSelect instanceof HTMLSelectElement) {
            newTodo.userId = Number(userSelect.value);
        }
        else {
            throw new Error("Unable to get userId from SELECT#".concat(GlobalIDs.USERS_SELECT_ID));
        }
        if (inputField instanceof HTMLInputElement) {
            newTodo.title = inputField.value;
        }
        else {
            throw new Error("Unable to get title from INPUT#".concat(GlobalIDs.INPUT_FIELD));
        }
        return newTodo;
    }
    function registerTodo(todo) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/todos', {
                            method: 'POST',
                            body: JSON.stringify(todo),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Unable to register new todo on server');
                }
            });
        });
    }
    function renderTodo(todo) {
        var li = document.createElement('li');
        li.className = 'todo-item';
        li.dataset.id = String(todo.id);
        li.innerHTML = "<span>".concat(todo.title, " <i>by</i> <b>").concat(getUserName(todo.userId), "</b></span>");
        var input = document.createElement('input');
        input.className = 'todo-status';
        input.type = 'checkbox';
        input.checked = todo.completed;
        var close = document.createElement('span');
        close.className = 'todo-close';
        close.textContent = '&times;';
        li.prepend(input);
        li.append(close);
        if (todoList) {
            todoList.prepend(li);
        }
        else {
            throw new Error("Unable to get UL#".concat(GlobalIDs.TODOS_UL_ID, " to insert new TODO"));
        }
    }
    function getUserName(userId) {
        var user = usersStore.find(function (u) { return u.id === userId; });
        return user ? user.name : 'Unknown';
    }
    function handleClickOnTodo(event) {
        return __awaiter(this, void 0, void 0, function () {
            var element, todoId, error_3, todoId, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        element = event.target;
                        if (!element || !(element instanceof HTMLElement))
                            return [2 /*return*/];
                        if (!(element.classList.contains('todo-status') &&
                            element instanceof HTMLInputElement)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        todoId = getParentTodoId(element);
                        return [4 /*yield*/, changeTodoStatus(todoId, element.checked)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error) {
                            console.error(error_3);
                            alert('Unable to change Todo status');
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        if (!element.classList.contains('todo-close')) return [3 /*break*/, 8];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        todoId = getParentTodoId(element);
                        return [4 /*yield*/, closeTodo(todoId)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        if (error_4 instanceof Error) {
                            console.error(error_4);
                            alert('Unable to delete Todo');
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function getParentTodoId(el) {
        var _a;
        var id = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.dataset.id;
        var idNumber = Number(id);
        if (!Number.isNaN(idNumber)) {
            return idNumber;
        }
        else {
            throw new Error("Unable to extract number from ID ".concat(id));
        }
    }
    function changeTodoStatus(todoId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var response, todo, data, inputElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://jsonplaceholder.typicode.com/todos/".concat(todoId), {
                            method: 'PATCH',
                            body: JSON.stringify({ completed: status }),
                            headers: { 'Content-Type': 'application/json' },
                        })];
                    case 1:
                        response = _a.sent();
                        todo = todosStore.find(function (t) { return t.id === todoId; });
                        if (!todo) return [3 /*break*/, 5];
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        todo.completed = status;
                        return [3 /*break*/, 4];
                    case 3:
                        inputElement = todoList === null || todoList === void 0 ? void 0 : todoList.querySelector("li[data-id=".concat(todoId, "] .todo-status"));
                        if (inputElement instanceof HTMLInputElement) {
                            inputElement.checked = todo.completed;
                        }
                        throw new Error('Unable to synchronize Todo status changing with server');
                    case 4: return [3 /*break*/, 6];
                    case 5: throw new Error('Can not find Todo to synchronize status in the todosStore');
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function closeTodo(todoId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://jsonplaceholder.typicode.com/todos/".concat(todoId), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            deleteTodo(todoId);
                        }
                        else {
                            throw new Error("Can not delete Todo with ID ".concat(todoId));
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteTodo(todoId) {
        // Delete from todosStore
        todosStore = todosStore.filter(function (t) { return t.id !== todoId; });
        // Delete from page
        var todoElement = todoList === null || todoList === void 0 ? void 0 : todoList.querySelector("li[data-id=".concat(todoId, "]"));
        todoElement === null || todoElement === void 0 ? void 0 : todoElement.remove();
    }
    function getUsers() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/users?_limit=5')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        try {
                            validateDataArray({
                                id: 'number',
                                name: 'string',
                            }, data);
                            return [2 /*return*/, data];
                        }
                        catch (error) {
                            throw new Error('Invalid format of Users data from server');
                        }
                        return [3 /*break*/, 4];
                    case 3: throw new Error('Impossible to load Users from server');
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function validateDataArray(config, data) {
        function validateObject(object) {
            Object.entries(config).forEach(function (_a) {
                var key = _a[0], type = _a[1];
                if (!(key in object) || typeof object[key] !== type) {
                    throw new Error('Data does not match the configuration');
                }
            });
        }
        if (Array.isArray(data)) {
            data.forEach(function (object) { return validateObject(object); });
        }
        else {
            throw new Error('Data object is not array');
        }
    }
    function getTodos() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('https://jsonplaceholder.typicode.com/todos?_limit=15')];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        try {
                            validateDataArray({
                                userId: 'number',
                                id: 'number',
                                title: 'string',
                                completed: 'boolean',
                            }, data);
                            return [2 /*return*/, data];
                        }
                        catch (error) {
                            throw new Error('Invalid format of Todos data from server');
                        }
                        return [3 /*break*/, 4];
                    case 3: throw new Error('Impossible to load Todos from server');
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function renderUserOption(user) {
        var option = new Option(user.name, String(user.id));
        userSelect === null || userSelect === void 0 ? void 0 : userSelect.append(option);
    }
})();
