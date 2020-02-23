import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { memoExists, getUploadUrl, updatePhotoUrl } from '../../businessLogic/memos'
import { getUserId } from '../utils'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const memoId = event.pathParameters.memoId
  const userId = getUserId(event)

  const validMemoId = await memoExists(memoId, userId)

  if (!validMemoId) {
    logger.info('Method: generateUploadUrl statusCode: 404, error: Memo item does not exist.')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Memo item does not exist'
      })
    }
  }

  try {
    const uploadUrl = await getUploadUrl(memoId, userId)
    
    await updatePhotoUrl(memoId, userId)
    
    logger.info('Method: generateUploadUrl PhotoUrl created')

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
          error: 'Error while uploading the photo.' + JSON.stringify({ err })
        })
      }
  }
})

handler.use(
  cors({
    credentials: true
  })
)