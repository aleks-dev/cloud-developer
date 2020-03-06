import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteMemo, memoExists } from '../../businessLogic/memos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Delete Memo')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const memoId = event.pathParameters.memoId
  const userId = getUserId(event)

  const validMemoId = await memoExists(memoId, userId)

  if (!validMemoId) {
    logger.info('Method: deleteMemo statusCode: 404, error: Memo item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Memo item does not exist'
      })
    }
  }

  try {
    await deleteMemo(memoId, userId)

    logger.info('Method: deleteMemo statusCode: 200')

    return {
      statusCode: 200,
      body: null
    }
  }
  catch (err) {
    logger.error('Method: deleteMemo statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
          error: "Error while deleting the new Memo item:" + JSON.stringify({ err })
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)