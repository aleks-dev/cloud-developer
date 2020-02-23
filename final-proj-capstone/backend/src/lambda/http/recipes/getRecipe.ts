import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../../utils/logger'

import { getIngredientsByRecipeId } from '../../../businessLogic/ingredients'
import { getUserId } from '../../helper'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const recipeId = event.pathParameters.recipeId
  const userId = getUserId(event)

  try {
    const result = await getIngredientsByRecipeId(recipeId, userId)

    if (result) {
      logger.info('Method: getIngredients statusCode: 200')

      return {
        statusCode: 200,
        body: JSON.stringify({ items: result })
      }
    }

    logger.info('Method: getIngredients statusCode: 404, error: Ingredient items do not exist')

    return {
      statusCode: 404,
      body: ''
    }
  } 
  catch (err) {
    logger.error('Method: getIngredients statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error while getting the Ingredients.'
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)