import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Ingredient, IngredientPrimKey } from '../models/Ingredient'
import { IngredientUpdate } from '../models/IngredientUpdate'
import { createDynamoDBClient } from '../utils/dynamoDBClient'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const bucketName = process.env.PHOTOS_S3_BUCKET
const ingredientIdIndex = process.env.INGREDIENT_ID_INDEX
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)


export class IngredientsRepo {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly ingredientsTable = process.env.INGREDIENTS_TABLE) {
  }


//#region INGREDIENTS

  async getIngredientsByUserId(userId: string): Promise<Ingredient[]> {
    try {
      const result = await this.docClient.query({
        TableName: this.ingredientsTable,
        KeyConditionExpression: 'userId = :primPartitionKey',
        ExpressionAttributeValues: {
          ':primPartitionKey': userId
        }
      }).promise()

      const items = result.Items
      return items as Ingredient[]
    }
    catch (err) {
      throw err;
    }
  }


  async getIngredientsByRecipeId(recipeId: string, userId: string): Promise<Ingredient[]> {
    try {
      const result = await this.docClient.query({
        TableName: this.ingredientsTable,
        IndexName: ingredientIdIndex,
        KeyConditionExpression: 'recipeId = :primPartitionKey',
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':primPartitionKey': recipeId,
          ':userId': userId
        }
      }).promise()

      const items = result.Items
      return items as Ingredient[]
    }
    catch (err) {
      throw err;
    }
  }


  async saveIngredientsForRecipeId(ingredients: Ingredient[], recipeId: string): Promise<Ingredient[]> {
    try {
      ingredients.forEach(ingr => {
        ingr.recipeId = recipeId;
      });

      var params = {
        RequestItems: { 
          ingredientsTable: [{
            PutRequest: {
              Item: ingredients
            }
          }]
        }
      };

      await this.docClient.batchWrite(params).promise()

      return ingredients
    }
    catch (err) {
      throw err;
    }
  }


  async removeAllIngredientsForRecipeId(recipeId: string) {
    try {
      var params = {
        RequestItems: { 
          ingredientsTable: [{
            DeleteRequest: {
              Key: { recipeId: recipeId }
            }
          }]
        }
      };

      await this.docClient.batchWrite(params).promise()
    }
    catch (err) {
      throw err;
    }
  }


  async createIngredient(ingredient: Ingredient): Promise<Ingredient> {
    try {
      await this.docClient.put({
        TableName: this.ingredientsTable,
        Item: ingredient
      }).promise()

      return ingredient
    }
    catch (err) {
      throw err;
    }
  }


  async updateIngredient(ingredientId: string, userId: string, ingredient: IngredientUpdate) {

    var params = {
      TableName: this.ingredientsTable,
      Key: {
        "userId": userId,
        "ingredientId": ingredientId
      },
      UpdateExpression: "set boughtDate = :bd, quantity = :qu",
      ExpressionAttributeValues: {
        ":bd": ingredient.boughtDate,
        ":qu": ingredient.quantity
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


  async deleteIngredient(ingredientId: string, userId: string) {

    var params = {
      TableName: this.ingredientsTable,
      Key: {
        "userId": userId,
        "ingredientId": ingredientId
      }
    }

    try {
      await this.docClient.delete(params).promise()
    }
    catch (err) {
      throw err;
    }
  }


  async ingredientExists(ingredientId: string, userId: string): Promise<Boolean> {
    try {
      const result = await this.docClient.get({
        TableName: this.ingredientsTable,
        Key: {
          "userId": userId,
          "ingredientId": ingredientId
        }
      }).promise()

      return !!result.Item
    }
    catch (err) {
      throw err;
    }
  }

//#endregion INGREDIENTS


//#region PHOTOS

  async getUploadUrl(ingredientId: string, userId: string) {

    userId = userId; //DUMMY

    const s3 = new XAWS.S3({
      signatureVersion: 'v4'
    })

    try {
      return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: ingredientId,
        // Key: { // TOCHECK: HOW TO PASS A COMPOSITE KEY ?
        //   "recipeId": recipeId,
        //   "ingredientId": ingredientId
        // },
        Expires: urlExpiration
      })
    }
    catch (err) {
      throw err;
    }
  }
  

  async updatePhotoUrl(ingredientId: string, userId: string) {

    var params = {
      TableName: this.ingredientsTable,
      Key: {
        "userId": userId,
        "ingredientId": ingredientId
      },
      UpdateExpression: "set photoUrl = :attURL",
      ExpressionAttributeValues: {
        ":attURL": `https://${bucketName}.s3.amazonaws.com/${ingredientId}`
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
}

//#endregion PHOTOS
