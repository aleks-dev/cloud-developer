import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateRecipeRequest } from '../../../requests/CreateRecipeRequest'
import { createRecipe } from '../../../businessLogic/recipes'
import { getUserId } from '../../helper'
import { createLogger } from '../../../utils/logger'

const logger = createLogger('auth')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newRecipe: CreateRecipeRequest = JSON.parse(event.body)

  const userId = getUserId(event)

  try {
    const newItem = await createRecipe(newRecipe, userId)
    
    logger.info('Method: createRecipe, statusCode: 201')

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  } catch (err) {
      logger.error('Method: createRecipe, statusCode: 500, error: ' + JSON.stringify({ err }))

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error while creating the new Recipe item:" + JSON.stringify({ err })
        })
      }
  }
})


handler.use(
  cors({
    credentials: true
  })
)
