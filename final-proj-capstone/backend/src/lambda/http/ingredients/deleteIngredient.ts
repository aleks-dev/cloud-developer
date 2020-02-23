import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteIngredient, ingredientExists } from '../../../businessLogic/ingredients'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const ingredientId = event.pathParameters.ingredientId
  const userId = getUserId(event)

  const validIngredientId = await ingredientExists(ingredientId, userId)

  if (!validIngredientId) {
    logger.info('Method: deleteIngredient statusCode: 404, error: Ingredient item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Ingredient item does not exist'
      })
    }
  }

  try {
    await deleteIngredient(ingredientId, userId)

    logger.info('Method: deleteIngredient statusCode: 200')

    return {
      statusCode: 200,
      body: null
    }
  }
  catch (err) {
    logger.error('Method: deleteIngredient statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
          error: "Error while deleting the new Ingredient item:" + JSON.stringify({ err })
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)