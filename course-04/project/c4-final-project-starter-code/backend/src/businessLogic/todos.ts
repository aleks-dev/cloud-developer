import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodosRepo } from '../data/todosRepo'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosRepo = new TodosRepo()


export async function getAllTodos(userId: string)
: Promise<TodoItem[]> {
  return todosRepo.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const itemId = uuid.v4()

  return await todosRepo.createTodo({      
    todoId: itemId,
    userId: userId,
    todoName: createTodoRequest.todoName,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null //DOESN'T EXIST IN THE CreateTodoRequest, THEREFORE I ASSUME IT WILL NOT BE PASSED ON CREATION.
  })
}


export async function updateTodo(
    todoId: string,
    userId: string,
    updateTodoRequest: UpdateTodoRequest,
  ) {
    await todosRepo.updateTodo(todoId,
                                userId,
                                {
                                  todoName: updateTodoRequest.todoName,
                                  dueDate: updateTodoRequest.dueDate,
                                  done: updateTodoRequest.done
                                })
  }

  export async function updateAttachmentUrl(
    todoId: string, 
    userId: string) 
  {
    await todosRepo.updateAttachmentUrl(todoId, userId)
  }


  export async function deleteTodo(
    todoId: string,
    userId: string
  ) {  
    await todosRepo.deleteTodo(todoId, userId)
  }


  export async function getUploadUrl(
    todoId: string,
    userId: string
  ): Promise<String> 
  {
    userId = userId; //TONOTICE: JUST A DUMMY ASSIGNMENT, TO AVOID COMPLAINMENTS BY TS DURING COMPILE-TIME.

    return await todosRepo.getUploadUrl(todoId, userId)
  }


  export async function todoExists(
    todoId: string,
    userId: string
  ): Promise<Boolean> 
  {
    return await todosRepo.todoExists(todoId, userId)
  }