import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodosRepo } from '../data/todosRepo'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const todoIdIndex = process.env.INDEX_NAME
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
const todosRepo = new TodosRepo()
const logger = createLogger('auth')


export async function getAllTodos(userId: string)
: Promise<TodoItem[]> {
  logger.info('getAllTodos userId: ' + userId)

  return todosRepo.getAllTodos(todoIdIndex, userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('createTodo userId: ' + userId)

  const itemId = uuid.v4()

  return await todosRepo.createTodo({      
    todoId: itemId,
    userId: userId,
    todoName: createTodoRequest.todoName,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
    //attachmentUrl: createTodoRequest.attachmentUrl - DOESN'T EXIST IN THE CreateTodoRequest, THEREFORE I ASSUME IT WILL NOT BE PASSED ON CREATION.
  })
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    userId: string
  ) {
    logger.info('updateTodo userId: ' + userId)

    await todosRepo.updateTodo(todoId,
      {
        todoName: updateTodoRequest.todoName,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
      },
      userId)
  }

  export async function deleteTodo(
    todoId: string,
    userId: string
  ) {
    logger.info('deleteTodo userId: ' + userId)
  
    await todosRepo.deleteTodo(todoId, userId)
  }

  export async function getUploadUrl(
    todoId: string,
    userId: string
  ): Promise<String> {
    logger.info('getUploadUrl userId: ' + userId)

    return await todosRepo.getUploadUrl(bucketName, todoId, userId, urlExpiration)
  }

  export async function todoExists(
    todoId: string,
    userId: string
  ): Promise<Boolean> {
    logger.info('todoExists userId: ' + userId)

    return await todosRepo.todoExists(todoId, userId)
  }