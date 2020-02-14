/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  todoName: string
  dueDate: string
  done: boolean
}