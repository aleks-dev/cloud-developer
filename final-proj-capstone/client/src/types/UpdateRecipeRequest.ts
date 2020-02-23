import { Ingredient } from "./Ingredient";

export interface UpdateRecipeRequest {
    recipeName?: string
    recipeDescription?: string
    ingredients?: Ingredient[]
  }