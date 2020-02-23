import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../../utils/logger'

import { ingredientExists, getUploadUrl, updatePhotoUrl } from '../../../businessLogic/ingredients'
import { getUserId } from '../../helper'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const ingredientId = event.pathParameters.ingredientId
  const userId = getUserId(event)

  const validIngredientId = await ingredientExists(ingredientId, userId)

  if (!validIngredientId) {
    logger.info('Method: generateUploadUrl statusCode: 404, error: Ingredient item does not exist.')

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Ingredient item does not exist'
      })
    }
  }

  try {
    const uploadUrl = await getUploadUrl(ingredientId, userId)
    
    await updatePhotoUrl(ingredientId, userId)
    
    logger.info('Method: generateUploadUrl PhotoUrl created')

    logger.info('Method: generateUploadUrl statusCode: 200')

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  } catch (err) {
      logger.error('Method: generateUploadUrl statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error while uploading the photo.' + JSON.stringify({ err })
        })
      }
  }
})

handler.use(
  cors({
    credentials: true
  })
)