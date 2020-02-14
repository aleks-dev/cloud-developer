import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // ISDONE: Implement creating a new TODO item
  const userId = getUserId(event)

  try {
    const newItem = await createTodo(newTodo, userId)
    
    logger.info('Method: createTodo, statusCode: 201')

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (err) {
      logger.error('Method: createTodo, statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error while creating the new Todo item:" + JSON.stringify({ err })
        })
      }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
