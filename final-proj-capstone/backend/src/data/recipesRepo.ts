import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Recipe } from '../models/Recipe'
import { RecipeUpdate } from '../models/RecipeUpdate'
import { createDynamoDBClient } from '../utils/dynamoDBClient'


export class RecipesRepo {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly recipesTable = process.env.RECIPES_TABLE) {
    }
  
  
  //#region RECIPES
  
    async getRecipesByUserId(userId: string): Promise<Recipe[]> {
      try {
        const result = await this.docClient.query({
          TableName: this.recipesTable,
          KeyConditionExpression: 'userId = :partitionKey',
          ExpressionAttributeValues: {
            ':partitionKey': userId
          }
        }).promise()
  
        const items = result.Items
        return items as Recipe[]
      }
      catch (err) {
        throw err;
      }
    }
  
    async createRecipe(recipe: Recipe): Promise<Recipe> {
      try {
        await this.docClient.put({
          TableName: this.recipesTable,
          Item: recipe
        }).promise()
  
        return recipe
      }
      catch (err) {
        throw err;
      }
    }
  
  
    async updateRecipe(userId: string, recipeId: string, recipe: RecipeUpdate) {
  
      var params = {
        TableName: this.recipesTable,
        Key: {
          "userId": userId,
          "recipeId": recipeId
        },
        UpdateExpression: "set recipeName = :rn, recipeDescription = :rd",
        ExpressionAttributeValues: {
          ":rn": recipe.recipeName,
          ":rd": recipe.recipeDescription
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
  
  
    async deleteRecipe(userId: string, recipeId: string) {
  
      var params = {
        TableName: this.recipesTable,
        Key: {
          "userId": userId,
          "recipeId": recipeId
        }
      }
  
      try {
        await this.docClient.delete(params).promise()
      }
      catch (err) {
        throw err;
      }
    }
  
  
    async recipeExists(userId: string, recipeId: string): Promise<Boolean> {
      try {
        const result = await this.docClient.get({
          TableName: this.recipesTable,
          Key: {
            "userId": userId,
            "recipeId": recipeId
          }
        }).promise()
  
        return !!result.Item
      }
      catch (err) {
        throw err;
      }
    }
  
  //#endregion RECIPES
}  