import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { searchMemos } from '../../businessLogic/memos'

const logger = createLogger('Search Memos')
const esHost = 'https://' + process.env.ES_ENDPOINT


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = getUserId(event)
        const searchPhrase = event.queryStringParameters.q.trim()

        const searchPhraseAccommodated = searchPhrase.replace('+', ' ')

        const result = await searchMemos(userId, searchPhraseAccommodated, esHost)

        if (result) {
            logger.info('Method: searchMemos statusCode: 200')

            return {
                statusCode: 200,
                body: JSON.stringify({ items: result })
            }
        }

    } catch (err) {
        logger.error('Method: searchMemos, statusCode: 500, error: ' + JSON.stringify({ err }))

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Error while searching Memos:" + JSON.stringify({ err })
            })
        }
    }
})

handler.use(
    cors({
        credentials: true
    })
)  