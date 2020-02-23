import * as uuid from 'uuid'
import { Recipe } from '../models/Recipe'
import { CreateRecipeRequest } from '../requests/CreateRecipeRequest'
import { UpdateRecipeRequest } from '../requests/UpdateRecipeRequest'
import { RecipesRepo } from '../data/recipesRepo'
import { IngredientsRepo } from '../data/ingredientsRepo'

const recipesRepo = new RecipesRepo()
const ingredientsRepo = new IngredientsRepo()


export async function getRecipesByUserId(userId: string)
: Promise<Recipe[]> {
  return recipesRepo.getRecipesByUserId(userId)
}

export async function createRecipe(
  createRecipeRequest: CreateRecipeRequest,
  userId: string
): Promise<Recipe> {

  const itemId = uuid.v4()

  try {
    var result = await recipesRepo.createRecipe({  
      userId: userId,
      recipeId: itemId,
      recipeName: createRecipeRequest.recipeName,
      recipeDescription: createRecipeRequest.recipeDescription
    })

    if (createRecipeRequest.ingredients && createRecipeRequest.ingredients.length > 0) {
      result.ingredients = await ingredientsRepo.saveIngredientsForRecipeId(createRecipeRequest.ingredients, itemId)
    }

    return result
  }
  catch (err){
    throw err;
  }
}


export async function updateRecipe(
    recipeId: string,
    userId: string,
    updateRecipeRequest: UpdateRecipeRequest,
  ) {
    try {
      await recipesRepo.updateRecipe(userId,
                                    recipeId,
                                    {
                                      recipeName: updateRecipeRequest.recipeName,
                                      recipeDescription: updateRecipeRequest.recipeDescription
                                    })

    
      if (updateRecipeRequest.ingredients && updateRecipeRequest.ingredients.length > 0) {
        await ingredientsRepo.removeAllIngredientsForRecipeId(recipeId)
        await ingredientsRepo.saveIngredientsForRecipeId(updateRecipeRequest.ingredients, recipeId)
      }
    }
    catch (err){
      throw err;
    }
  }


  export async function deleteRecipe(
    recipeId: string,
    userId: string
  ) {  
    await recipesRepo.deleteRecipe(recipeId, userId)
  }


  export async function recipeExists(
    recipeId: string,
    userId: string
  ): Promise<Boolean> 
  {
    return await recipesRepo.recipeExists(recipeId, userId)
  }