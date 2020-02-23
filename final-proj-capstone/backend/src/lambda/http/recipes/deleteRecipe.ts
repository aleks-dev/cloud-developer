import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteRecipe, recipeExists } from '../../../businessLogic/recipes'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const recipeId = event.pathParameters.recipeId
  const userId = getUserId(event)

  const validRecipeId = await recipeExists(recipeId, userId)

  if (!validRecipeId) {
    logger.info('Method: deleteRecipe statusCode: 404, error: Recipe item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Recipe item does not exist'
      })
    }
  }

  try {
    await deleteRecipe(recipeId, userId)

    logger.info('Method: deleteRecipe statusCode: 200')

    return {
      statusCode: 200,
      body: null
    }
  }
  catch (err) {
    logger.error('Method: deleteRecipe statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
          error: "Error while deleting the new Recipe item:" + JSON.stringify({ err })
      })
    }
  }
})

handler.use(
  cors({
    credentials: true
  })
)