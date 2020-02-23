import * as uuid from 'uuid'
import { Ingredient } from '../models/Ingredient'
import { CreateIngredientRequest } from '../requests/CreateIngredientRequest'
import { IngredientsRepo } from '../data/ingredientsRepo'
import { UpdateIngredientRequest } from '../requests/UpdateIngredientRequest'

const ingredientsRepo = new IngredientsRepo()


export async function getIngredientsByUserId(userId: string)
: Promise<Ingredient[]> {
  return await ingredientsRepo.getIngredientsByUserId(userId)
}

export async function getIngredientsByRecipeId(
  recipeId: string,
  userId: string)
: Promise<Ingredient[]> {

  return await ingredientsRepo.getIngredientsByRecipeId(recipeId, userId)
}

export async function createIngredient(
  createIngredientRequest: CreateIngredientRequest,
  userId: string
): Promise<Ingredient> {

  const itemId = uuid.v4()

  return await ingredientsRepo.createIngredient({   
    ingredientId: itemId,
    userId: userId,
    ingredientName: createIngredientRequest.ingredientName,
    photoUrl: null
  })
}


export async function updateIngredient(
    ingredientId: string,
    userId: string,
    updateIngredientRequest: UpdateIngredientRequest,
  ) {

    await ingredientsRepo.updateIngredient(ingredientId,
                                            userId,
                                            {
                                              quantity: updateIngredientRequest.quantity,
                                              boughtDate: updateIngredientRequest.boughtDate
                                            })
  }

  export async function updatePhotoUrl(
    ingredientId: string, 
    userId: string) 
  {
    await ingredientsRepo.updatePhotoUrl(ingredientId, userId)
  }


  export async function deleteIngredient(
    ingredientId: string,
    userId: string
  ) {  
    await ingredientsRepo.deleteIngredient(ingredientId, userId)
  }


  export async function getUploadUrl(
    ingredientId: string,
    userId: string
  ): Promise<String> 
  {
    return await ingredientsRepo.getUploadUrl(ingredientId, userId)
  }


  export async function ingredientExists(
    ingredientId: string,
    userId: string
  ): Promise<Boolean> 
  {
    return await ingredientsRepo.ingredientExists(ingredientId, userId)
  }