import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { getAllMemos } from '../../businessLogic/memos'
import { getUserId } from '../utils'

const logger = createLogger('Get Memos')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  try {
    const result = await getAllMemos(userId)

    if (result) {
      logger.info('Method: getMemos statusCode: 200')

      return {
        statusCode: 200,
        body: JSON.stringify({ items: result })
      }
    }

    logger.info('Method: getMemos statusCode: 404, error: Memo items do not exist')

    return {
      statusCode: 404,
      body: ''
    }
  } 
  catch (err) {
    logger.error('Method: getMemos statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error while getting the Memos.'
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)