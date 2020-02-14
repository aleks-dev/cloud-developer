import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosRepo {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }


  async getAllTodos(indexName: string, userId: string): Promise<TodoItem[]> {
    //console.log('Getting all todos')

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :partitionKey',
      ExpressionAttributeValues: {
        ':partitionKey': userId
      }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }


  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todoId: string, todo: TodoUpdate, userId: string) {
    userId = userId; //JUST A DUMMY TEMPORARY ASSIGNMENT

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
      ReturnValues: "ALL_NEW"
    }

    try {
      await this.docClient.update(params).promise()
    } catch (e) {
      throw e;
    }
  }

  async deleteTodo(todoId: string, userId: string) {
    userId = userId; //JUST A DUMMY TEMPORARY ASSIGNMENT

    var params = {
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      }
    }

    await this.docClient.delete(params).promise()
  }

  async todoExists(todoId: string, userId: string): Promise<Boolean> {
    userId = userId; //JUST A DUMMY TEMPORARY ASSIGNMENT

    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        "userId": userId,
        "todoId": todoId
      }
    }).promise()

    return !!result.Item
  }

  async getUploadUrl(bucketName: string, todoId: string, userId: string, urlExpiration: number) {
    userId = userId; //JUST A DUMMY TEMPORARY ASSIGNMENT

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
    catch (e) {
      throw e
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
