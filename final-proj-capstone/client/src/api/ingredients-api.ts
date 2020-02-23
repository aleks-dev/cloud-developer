import { apiEndpoint } from '../config'
import { Ingredient } from '../types/Ingredient';
import { CreateIngredientRequest } from '../types/CreateIngredientRequest';
import Axios from 'axios'
import { UpdateIngredientRequest } from '../types/UpdateIngredientRequest';


export async function getIngredients(idToken: string): Promise<Ingredient[]> {
  console.log('Fetching ingredients')

  const response = await Axios.get(`${apiEndpoint}/ingredients`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Ingredients:', response.data)
  return response.data.items
}

export async function createIngredient(
  idToken: string,
  newIngredient: CreateIngredientRequest
): Promise<Ingredient> {
  const response = await Axios.post(`${apiEndpoint}/ingredients`,  JSON.stringify(newIngredient), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchIngredient(
  idToken: string,
  ingredientId: string,
  updatedIngredient: UpdateIngredientRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/ingredients/${ingredientId}`, JSON.stringify(updatedIngredient), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteIngredient(
  idToken: string,
  ingredientId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/ingredients/${ingredientId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  ingredientId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/ingredients/${ingredientId}/photo`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
