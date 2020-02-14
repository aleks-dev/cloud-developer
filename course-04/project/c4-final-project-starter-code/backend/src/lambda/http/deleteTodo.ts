import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTodo, todoExists } from '../../businessLogic/todos'
import { getUserId } from '../utils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const todoId = event.pathParameters.todoId
  // ISDONE: Remove a TODO item by id
  const userId = getUserId(event)

  const validTodoId = await todoExists(todoId, userId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  try {
    await deleteTodo(todoId, userId)

    return {
      statusCode: 200,
      body: null
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
          error: "Error while deleting the new Todo item:" + JSON.stringify({e})
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)