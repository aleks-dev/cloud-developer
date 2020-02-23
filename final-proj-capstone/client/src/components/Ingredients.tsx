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

import { createIngredient, deleteIngredient, getIngredients, patchIngredient } from '../api/ingredients-api'
import Auth from '../auth/Auth'
import { Ingredient } from '../types/Ingredient'

interface IngredientsProps {
  auth: Auth
  history: History
}

interface IngredientsState {
  ingredients: Ingredient[]
  newIngredientName: string
  loadingIngredients: boolean
}

export class Ingredients extends React.PureComponent<IngredientsProps, IngredientsState> {
  state: IngredientsState = {
    ingredients: [],
    newIngredientName: '',
    loadingIngredients: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newIngredientName: event.target.value })
  }

  onEditButtonClick = (ingredientId: string) => {
    this.props.history.push(`/ingredients/${ingredientId}/edit`)
  }

  onIngredientCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newIngredient = await createIngredient(this.props.auth.getIdToken(), {
        ingredientName: this.state.newIngredientName,
      })
      this.setState({
        ingredients: [...this.state.ingredients, newIngredient],
        newIngredientName: ''
      })
    } catch {
      alert('Ingredient creation failed')
    }
  }

  onIngredientDelete = async (ingredientId: string) => {
    try {
      await deleteIngredient(this.props.auth.getIdToken(), ingredientId)
      this.setState({
        ingredients: this.state.ingredients.filter(ingredient => ingredient.ingredientId != ingredientId)
      })
    } catch {
      alert('Ingredient deletion failed')
    }
  }

  onIngredientCheck = async (pos: number) => {
    try {
      const ingredient = this.state.ingredients[pos]
      await patchIngredient(this.props.auth.getIdToken(), 
      ingredient.ingredientId, 
      {
        quantity: ingredient.quantity,
        boughtDate: ingredient.boughtDate
      })
      this.setState({
        ingredients: update(this.state.ingredients, {
          [pos]: { boughtDate: { $set: ingredient.boughtDate } }
        })
      })
    } catch {
      alert('Ingredient deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const ingredients = await getIngredients(this.props.auth.getIdToken())
      this.setState({
        ingredients,
        loadingIngredients: false
      })
    } catch (e) {
      alert(`Failed to fetch ingredients: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Ingredients</Header>

        {this.renderCreateIngredientInput()}

        {this.renderIngredients()}
      </div>
    )
  }

  renderCreateIngredientInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New ingredient',
              onClick: this.onIngredientCreate
            }}
            fluid
            actionPosition="left"
            placeholder="The best ingredient in the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderIngredients() {
    if (this.state.loadingIngredients) {
      return this.renderLoading()
    }

    return this.renderIngredientsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Ingredients
        </Loader>
      </Grid.Row>
    )
  }

  renderIngredientsList() {
    return (
      <Grid padded>
        {this.state.ingredients.map((ingredient, pos) => {
          return (
            <Grid.Row key={ingredient.ingredientId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onIngredientCheck(pos)}
                  checked={!!ingredient.boughtDate}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {ingredient.ingredientName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {ingredient.boughtDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(ingredient.ingredientId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onIngredientDelete(ingredient.ingredientId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {ingredient.photoUrl && (
                <Image src={ingredient.photoUrl} size="small" wrapped />
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
