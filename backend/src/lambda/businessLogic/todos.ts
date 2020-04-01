import * as uuid from 'uuid'

import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from '../../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  const todoId = uuid.v4()
  return todoAccess.createTodo({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().getTime().toString(),
      done: false,
      ...createTodoRequest,
  });
}

export function deleteTodo(todoId: string): Promise<string> {
  return todoAccess.deleteTodoById(todoId);
}

export function updateTodo(todoId: string, updatedTodo: TodoUpdate): Promise<TodoItem> {
  return todoAccess.updateTodo(todoId, updatedTodo);
}
