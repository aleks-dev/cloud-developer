import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // ISDONE: Get all TODO items for a current user
  // TODO: implement logging
  //console.log('Caller event', event)
  const userId = getUserId(event)

  try {
    const result = await getAllTodos(userId)

    if (result && result.length !== 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ items: result })
      }
    }

    return {
      statusCode: 404,
      body: ''
    }
  } catch {
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