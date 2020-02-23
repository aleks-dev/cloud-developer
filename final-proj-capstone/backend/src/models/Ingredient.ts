export interface Ingredient {
  userId: string
  recipeId?: string
  ingredientId: string
  ingredientName: string
  quantity?: string,
  boughtDate?: string
  photoUrl?: string
}

export interface IngredientPrimKey {
  recipeId: string
  ingredientId: string
}


export interface IngredientSecKey {
  userId: string
  ingredientId: string
}