import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const todoIdIndex = process.env.INDEX_NAME
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)


export class TodosRepo {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }


  async getAllTodos(userId: string): Promise<TodoItem[]> {
    try {
      const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: todoIdIndex,
        KeyConditionExpression: 'userId = :partitionKey',
        ExpressionAttributeValues: {
          ':partitionKey': userId
        }
      }).promise()

      const items = result.Items
      return items as TodoItem[]

    }
    catch (err) {
      throw err;
    }
  }


  async createTodo(todo: TodoItem): Promise<TodoItem> {
    try {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()

      return todo
    }
    catch (err) {
      throw err;
    }
  }


  async updateTodo(todoId: string, userId: string, todo: TodoUpdate) {

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set todoName = :n, dueDate = :dd, done = :d",
      ExpressionAttributeValues: {
        ":n": todo.todoName,
        ":dd": todo.dueDate,
        ":d": todo.done
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


  async updateAttachmentUrl(todoId: string, userId: string) {

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      },
      UpdateExpression: "set attachmentUrl = :attURL",
      ExpressionAttributeValues: {
        ":attURL": `https://${bucketName}.s3.amazonaws.com/${todoId}`
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


  async deleteTodo(todoId: string, userId: string) {

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      }
    }

    try {
      await this.docClient.delete(params).promise()
    }
    catch (err) {
      throw err;
    }
  }


  async todoExists(todoId: string, userId: string): Promise<Boolean> {
    try {
      const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {
          "userId": userId,
          "todoId": todoId
        }
      }).promise()

      return !!result.Item
    }
    catch (err) {
      throw err;
    }
  }


  async getUploadUrl(todoId: string, userId: string) {

    userId = userId; //TONOTICE: JUST A DUMMY ASSIGNMENT, TO AVOID COMPLAINMENTS BY TS DURING COMPILE-TIME.

    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    try {
      return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        // Key: { // TOCHECK: HOW TO PASS A COMPOSITE KEY ?
        //   "userId": userId,
        //   "todoId": todoId
        // },
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