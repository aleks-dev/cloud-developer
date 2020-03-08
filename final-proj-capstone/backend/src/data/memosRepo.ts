import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Memo } from '../models/Memo'
import * as httpAwsEs from 'http-aws-es'
import { createLogger } from '../utils/logger'
import * as elasticsearch from 'elasticsearch'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.PHOTOS_S3_BUCKET
const memoIdIndex = process.env.MEMO_NAME_INDEX
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

const logger = createLogger('memosRepo')


export class MemosRepo {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly memosTable = process.env.MEMOS_TABLE) {
  }


  async getAllMemos(userId: string): Promise<Memo[]> {
    try {
      const result = await this.docClient.query({
        TableName: this.memosTable,
        IndexName: memoIdIndex,
        KeyConditionExpression: 'userId = :partitionKey',
        ExpressionAttributeValues: {
          ':partitionKey': userId
        }
      }).promise()

      const items = result.Items
      return items as Memo[]

    }
    catch (err) {
      throw err;
    }
  }


  async searchMemos(userId: string, searchPhrase: string, esHost: string, searchObj: any): Promise<string> { //Promise<Memo[]> { //
    //TODO: rmeove at the end
    userId = userId;
    searchPhrase = searchPhrase;

    try {
      const client = new elasticsearch.Client({ 
        hosts: [ esHost ],
        connectionClass: httpAwsEs
      })

      logger.info('Method: searchMemos, esHost:' + JSON.stringify(esHost))
      

      const result = await client.search(searchObj) as elasticsearch.SearchResponse<string>
      
      logger.info('Method: searchMemos, result:' + JSON.stringify(result))

      const items = result//..Items //body

      logger.info('Method: searchMemos, items count:' + result) //.count
      logger.info('Method: searchMemos, items:' + JSON.stringify(items))

      return JSON.stringify(items) //as Memo[]
    }
    catch (err) {
      logger.error('Method: searchMemos, result:' + JSON.stringify(err))

      throw err;
    }
  }


  async createMemo(memo: Memo): Promise<Memo> {
    try {
      await this.docClient.put({
        TableName: this.memosTable,
        Item: memo
      }).promise()

      return memo
    }
    catch (err) {
      throw err;
    }
  }



  async updatePhotoUrl(memoId: string, userId: string) {

    var params = {
      TableName: this.memosTable,
      Key: {
        "userId": userId,
        "memoId": memoId
      },
      UpdateExpression: "set photoUrl = :attURL",
      ExpressionAttributeValues: {
        ":attURL": `https://${bucketName}.s3.amazonaws.com/${memoId}`
      },
      ReturnValues: "NONE"
    }

    try {
      await this.docClient.update(params).promise()
    }
    catch (err) {
      throw err;
    }
  }


  async deleteMemo(memoId: string, userId: string) {

    var params = {
      TableName: this.memosTable,
      Key: {
        "userId": userId,
        "memoId": memoId
      }
    }

    try {
      await this.docClient.delete(params).promise()
    }
    catch (err) {
      throw err;
    }
  }


  async memoExists(memoId: string, userId: string): Promise<Boolean> {
    try {
      const result = await this.docClient.get({
        TableName: this.memosTable,
        Key: {
          "userId": userId,
          "memoId": memoId
        }
      }).promise()

      return !!result.Item
    }
    catch (err) {
      throw err;
    }
  }


  async getUploadUrl(memoId: string, userId: string) {

    userId = userId; //TONOTICE: JUST A DUMMY ASSIGNMENT, TO AVOID COMPLAINTS BY TS DURING COMPILE-TIME.

    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    try {
      return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: memoId,
        Expires: urlExpiration
      })
    }
    catch (err) {
      throw err;
    }
  }
}



function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}