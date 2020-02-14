import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { todoExists, getUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Return a presigned URL to upload a file for a TODO item with the provided id
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const validTodoId = await todoExists(todoId, userId)

  if (!validTodoId) {
    logger.info('Method: generateUploadUrl statusCode: 404, error: Todo item does not exist.')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Todo item does not exist'
      })
    }
  }

  try {
    const uploadUrl = await getUploadUrl(todoId, userId)
    
    await updateAttachmentUrl(todoId, userId)
    
    logger.info('Method: generateUploadUrl AttachmentUrl created')

    logger.info('Method: generateUploadUrl statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (err) {
      logger.error('Method: generateUploadUrl statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error while uploading the attachment.' + JSON.stringify({ err })
        })
      }
  }
})

handler.use(
  cors({
    credentials: true
  })
)