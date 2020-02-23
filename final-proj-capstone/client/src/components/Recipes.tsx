import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createRecipe, deleteRecipe, getRecipes, patchRecipe, saveIngredientsForRecipe } from '../api/recipes-api'
import Auth from '../auth/Auth'
import { Recipe } from '../types/Recipe'
import { Ingredient } from '../types/Recipe'

interface RecipesProps {
  auth: Auth
  history: History
}

interface RecipesState {
  recipes: Recipe[]
  newRecipeName: string
  newRecipeDescr: string
  newRecipeIngredients: Recipe[]
  loadingRecipes: boolean
}

export class Recipes extends React.PureComponent<RecipesProps, RecipesState> {
  state: RecipesState = {
    recipes: [],
    newRecipeName: '',
    newRecipeDescr: '',
    newRecipeIngredients: [],
    loadingRecipes: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeName: event.target.value })
  }
  
  handleDescrChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newRecipeDescr: event.target.value })
  }

  handleIngredientsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
        const newRecipeIngredients = await saveIngredientsForRecipe(
            this.props.auth.getIdToken(), {
            recipeName: this.state.newRecipeName,
        })

        this.setState({ newRecipeIngredients: [...this.state.newRecipeIngredients, event.target.value ] })
    } catch {
        alert('Recipe creation failed')
      }
  }

  onEditButtonClick = (recipeId: string) => {
    this.props.history.push(`/recipes/${recipeId}/edit`)
  }

  onRecipeCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newRecipe = await createRecipe(
        this.props.auth.getIdToken(), 
        {
            recipeName: this.state.newRecipeName,
        })

      this.setState({
        recipes: [...this.state.recipes, newRecipe],
        newRecipeName: ''
      })
    } catch {
      alert('Recipe creation failed')
    }
  }

  onRecipeDelete = async (recipeId: string) => {
    try {
      await deleteRecipe(this.props.auth.getIdToken(), recipeId)
      this.setState({
        recipes: this.state.recipes.filter(recipe => recipe.recipeId != recipeId)
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  onRecipeCheck = async (pos: number) => {
    try {
      const recipe = this.state.recipes[pos]
      await patchRecipe(this.props.auth.getIdToken(), 
      recipe.recipeId, 
      {
        quantity: recipe.quantity,
        boughtDate: recipe.boughtDate
      })
      this.setState({
        recipes: update(this.state.recipes, {
          [pos]: { boughtDate: { $set: recipe.boughtDate } }
        })
      })
    } catch {
      alert('Recipe deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const recipes = await getRecipes(this.props.auth.getIdToken())
      this.setState({
        recipes,
        loadingRecipes: false
      })
    } catch (e) {
      alert(`Failed to fetch recipes: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Recipes</Header>

        {this.renderCreateRecipeInput()}

        {this.renderRecipes()}
      </div>
    )
  }

  renderCreateRecipeInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New recipe',
              onClick: this.onRecipeCreate
            }}
            fluid
            actionPosition="left"
            placeholder="The best recipe in the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderRecipes() {
    if (this.state.loadingRecipes) {
      return this.renderLoading()
    }

    return this.renderRecipesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Recipes
        </Loader>
      </Grid.Row>
    )
  }

  renderRecipesList() {
    return (
      <Grid padded>
        {this.state.recipes.map((recipe, pos) => {
          return (
            <Grid.Row key={recipe.recipeId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onRecipeCheck(pos)}
                  checked={!!recipe.boughtDate}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {recipe.recipeName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {recipe.boughtDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(recipe.recipeId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onRecipeDelete(recipe.recipeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {recipe.photoUrl && (
                <Image src={recipe.photoUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateBoughtDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
