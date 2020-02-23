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