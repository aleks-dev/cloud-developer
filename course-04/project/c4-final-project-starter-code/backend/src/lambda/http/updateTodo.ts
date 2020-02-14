import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo, todoExists } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(todoId, userId)
  
  if (!validTodoId) {
    logger.info('Method: updateTodo, statusCode: 404, error: Todo item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
  try {
    const updatedItem = await updateTodo(
      todoId,
      userId,
      updatedTodo
    )

    logger.info('Method: updateTodo statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  } catch (err) {
    logger.error('Method: updateTodo statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error while updating the Todo item: " + JSON.stringify({ err })
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
