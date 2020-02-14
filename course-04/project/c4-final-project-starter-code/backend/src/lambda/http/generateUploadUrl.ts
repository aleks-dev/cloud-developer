import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { todoExists, getUploadUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Return a presigned URL to upload a file for a TODO item with the provided id
  
  const todoId = event.pathParameters.todoId
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
    const uploadUrl = await getUploadUrl(todoId, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error while uploading the attachment.' + JSON.stringify({ e })
        })
      }
  }
})

handler.use(
  cors({
    credentials: true
  })
)