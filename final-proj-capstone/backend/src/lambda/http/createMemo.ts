import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateMemoRequest } from '../../requests/CreateMemoRequest'
import { createMemo } from '../../businessLogic/memos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('Create Memo')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newMemo: CreateMemoRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const newItem = await createMemo(newMemo, userId)
    
    logger.info('Method: createMemo, statusCode: 201')

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (err) {
      logger.error('Method: createMemo, statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error while creating the new Memo item:" + JSON.stringify({ err })
        })
      }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
