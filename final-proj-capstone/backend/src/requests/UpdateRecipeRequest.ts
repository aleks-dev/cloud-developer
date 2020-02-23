import { Ingredient } from "../models/Ingredient";

export interface UpdateRecipeRequest {
    recipeName?: string
    recipeDescription?: string
    ingredients?: Ingredient[]
  }