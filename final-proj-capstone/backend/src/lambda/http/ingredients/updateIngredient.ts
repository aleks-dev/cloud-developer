import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateIngredientRequest } from '../../../requests/UpdateIngredientRequest'
import { updateIngredient, ingredientExists } from '../../../businessLogic/ingredients'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)
  const ingredientId = event.pathParameters.ingredientId
  const validIngredientId = await ingredientExists(ingredientId, userId)
  
  if (!validIngredientId) {
    logger.info('Method: updateIngredient, statusCode: 404, error: Ingredient item does not exist')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Ingredient item does not exist'
      })
    }
  }

  const updatedIngredient: UpdateIngredientRequest = JSON.parse(event.body)
  
  try {
    const updatedItem = await updateIngredient(
      ingredientId,
      userId,
      updatedIngredient
    )

    logger.info('Method: updateIngredient statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  } catch (err) {
    logger.error('Method: updateIngredient statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error while updating the Ingredient item: " + JSON.stringify({ err })
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
