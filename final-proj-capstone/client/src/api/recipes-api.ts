import Axios from 'axios'
import { apiEndpoint } from '../config'
import { Recipe } from '../types/Recipe';
import { CreateRecipeRequest } from '../types/CreateRecipeRequest';
import { UpdateRecipeRequest } from '../types/UpdateRecipeRequest';
import { Ingredient } from '../types/Ingredient';


export async function getRecipes(idToken: string): Promise<Recipe[]> {
  console.log('Fetching recipes')

  const response = await Axios.get(`${apiEndpoint}/recipes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Recipes:', response.data)
  return response.data.items
}

export async function getRecipe(
    idToken: string,
    recipeId: string
  ): Promise<Recipe> {
    const response = await Axios.get(`${apiEndpoint}/recipes/${recipeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })

    return response.data.item
  }
  
export async function saveIngredientsForRecipe(
  idToken: string,
  recipeId: string,
  ingredients: Ingredient[]
  ): Promise<Recipe> {
  console.log('Saving ingredients for recipe')

  const response = await Axios.patch(`${apiEndpoint}/recipes/${recipeId}`, 
                                      JSON.stringify(ingredients),
                                      {
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${idToken}`
                                        },
                                      })
  
  console.log('Recipe with ingredients:', response.data)

  return response.data.items
}
  
export async function removeIngredientsFromRecipe(
  idToken: string,
  recipeId: string,
  ingredientIds: Int32Array
  ) {
  console.log('Removing ingredients from recipe')

  const response = await Axios.patch(`${apiEndpoint}/recipes/${recipeId}`, 
                                      JSON.stringify(ingredientIds),
                                      {
                                        headers: {
                                          'Content-Type': 'application/json',
                                          'Authorization': `Bearer ${idToken}`
                                        },
                                      })
  
  console.log('Ingredients removed from recipe:', response.data)
}

export async function createRecipe(
  idToken: string,
  newRecipe: CreateRecipeRequest
): Promise<Recipe> {
  const response = await Axios.post(`${apiEndpoint}/recipes`,  JSON.stringify(newRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRecipe(
  idToken: string,
  recipeId: string,
  updatedRecipe: UpdateRecipeRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/recipes/${recipeId}`, JSON.stringify(updatedRecipe), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRecipe(
  idToken: string,
  recipeId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/recipes/${recipeId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
