import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo, todoExists } from '../../businessLogic/todos'
import { getUserId } from '../utils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = getUserId(event)

  const todoId = event.pathParameters.todoId
  const validTodoId = await todoExists(todoId, userId)

  if (!validTodoId) {
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
      updatedTodo,
      userId
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedItem
      })
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error while updating the Todo item: " + JSON.stringify({e})
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
