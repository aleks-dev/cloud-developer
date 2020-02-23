import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../../utils/logger'

import { getRecipesByUserId } from '../../../businessLogic/recipes'
import { getUserId } from '../../helper'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  try {
    const result = await getRecipesByUserId(userId)

    if (result) {
      logger.info('Method: getRecipes statusCode: 200')

      return {
        statusCode: 200,
        body: JSON.stringify({ items: result })
      }
    }

    logger.info('Method: getRecipes statusCode: 404, error: Recipe items do not exist')

    return {
      statusCode: 404,
      body: ''
    }
  } 
  catch (err) {
    logger.error('Method: getRecipes statusCode: 500, error: ' + JSON.stringify({ err }))

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error while getting the Recipes.'
      })
    }
  }
})


handler.use(
  cors({
    credentials: true
  })
)