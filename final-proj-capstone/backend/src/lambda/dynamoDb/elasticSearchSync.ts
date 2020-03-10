import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../../utils/logger'
import * as elasticsearch from 'elasticsearch'

const esHost = process.env.ES_ENDPOINT
const logger = createLogger('Elastic Search Sync')

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  logger.info('Processing events batch from DynamoDB', JSON.stringify(event))

  logger.info('esHost: ', JSON.stringify(esHost))

  for (const record of event.Records) {
    
    if (record.eventName !== 'INSERT') {
      continue
    }
    
    logger.info('Processing record', JSON.stringify(record))

    const newItem = record.dynamodb.NewImage

    const body = {
      userId: newItem.userId.S,
      memoId: newItem.memoId.S,
      createdDate: newItem.createdDate.S,
      memoName: newItem.memoName.S,
      photoUrl: newItem.photoUrl.S
    }

    await es.index({
      index: 'memos-index',
      type: 'memos',
      id: newItem.memoId.S,
      body
    })

  }
}