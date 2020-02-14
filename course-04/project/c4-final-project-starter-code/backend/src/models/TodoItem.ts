export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  todoName: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
