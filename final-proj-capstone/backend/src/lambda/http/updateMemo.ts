import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateMemoRequest } from '../../requests/UpdateMemoRequest'
import { updateMemo, memoExists } from '../../businessLogic/memos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  const memoId = event.pathParameters.memoId
  const validMemoId = await memoExists(memoId, userId)
  
  if (!validMemoId) {
    logger.info('Method: updateMemo, statusCode: 404, error: Memo item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Memo item does not exist'
      })
    }
  }

  const updatedMemo: UpdateMemoRequest = JSON.parse(event.body)
  
  try {
    const updatedItem = await updateMemo(
      memoId,
      userId,
      updatedMemo
    )

    logger.info('Method: updateMemo statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  } catch (err) {
    logger.error('Method: updateMemo statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error while updating the Memo item: " + JSON.stringify({ err })
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
