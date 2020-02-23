import { Ingredient } from "./Ingredient";

export interface CreateRecipeRequest {
    recipeName: string
    recipeDescription?: string
    ingredients?: Ingredient[]
  }