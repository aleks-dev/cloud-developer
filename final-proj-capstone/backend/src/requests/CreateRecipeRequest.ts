import { Ingredient } from "../models/Ingredient";

export interface CreateRecipeRequest {
    recipeName: string
    recipeDescription?: string
    ingredients?: Ingredient[]
  }