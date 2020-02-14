import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Get all TODO items for a current user
  const userId = getUserId(event)

  try {
    const result = await getAllTodos(userId)

    if (result && result.length !== 0) {
      logger.info('Method: getTodos statusCode: 200')

      return {
        statusCode: 200,
        body: JSON.stringify({ items: result })
      }
    }

    logger.info('Method: getTodos statusCode: 404, error: Todo items do not exist')

    return {
      statusCode: 404,
      body: ''
    }
  } 
  catch (err) {
    logger.error('Method: getTodos statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error while getting the Todos.'
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)