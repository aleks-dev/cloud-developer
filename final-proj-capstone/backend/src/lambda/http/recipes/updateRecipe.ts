import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateRecipeRequest } from '../../../requests/UpdateRecipeRequest'
import { updateRecipe, recipeExists } from '../../../businessLogic/recipes'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)
  const recipeId = event.pathParameters.recipeId
  const validRecipeId = await recipeExists(recipeId, userId)
  
  if (!validRecipeId) {
    logger.info('Method: updateRecipe, statusCode: 404, error: Recipe item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Recipe item does not exist'
      })
    }
  }

  const updatedRecipe: UpdateRecipeRequest = JSON.parse(event.body)
  
  try {
    const updatedItem = await updateRecipe(
      recipeId,
      userId,
      updatedRecipe
    )

    logger.info('Method: updateRecipe statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  } catch (err) {
    logger.error('Method: updateRecipe statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error while updating the Recipe item: " + JSON.stringify({ err })
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
