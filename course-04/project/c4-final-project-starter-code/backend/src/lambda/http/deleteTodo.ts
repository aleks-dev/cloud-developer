import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTodo, todoExists } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId
  // ISDONE: Remove a TODO item by id
  const userId = getUserId(event)

  const validTodoId = await todoExists(todoId, userId)

  if (!validTodoId) {
    logger.info('Method: deleteTodo statusCode: 404, error: Todo item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  try {
    await deleteTodo(todoId, userId)

    logger.info('Method: deleteTodo statusCode: 200')

    return {
      statusCode: 200,
      body: null
    }
  }
  catch (err) {
    logger.error('Method: deleteTodo statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
          error: "Error while deleting the new Todo item:" + JSON.stringify({ err })
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)