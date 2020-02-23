import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateIngredientRequest } from '../../../requests/CreateIngredientRequest'
import { createIngredient } from '../../../businessLogic/ingredients'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newIngredient: CreateIngredientRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const newItem = await createIngredient(newIngredient, userId)
    
    logger.info('Method: createIngredient, statusCode: 201')

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (err) {
      logger.error('Method: createIngredient, statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error while creating the new Ingredient item:" + JSON.stringify({ err })
        })
      }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
