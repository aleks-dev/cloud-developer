import { Ingredient } from "./Ingredient";

export interface Recipe {
    userId: string
    recipeId: string
    recipeName: string
    recipeDescription?: string
    ingredients?: Ingredient[]
  }
  