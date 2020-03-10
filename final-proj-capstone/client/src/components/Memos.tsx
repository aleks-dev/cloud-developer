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

import { createMemo, deleteMemo, getMemos, searchMemos } from '../api/memos-api'
import Auth from '../auth/Auth'
import { Memo } from '../types/Memo'

interface MemosProps {
  auth: Auth
  history: History
}

interface MemosState {
  memos: Memo[]
  memosSearch: Memo[]
  memosSearchPhrase: string
  newMemoName: string
  loadingMemos: boolean
  searchButtonClicked: boolean
}

export class Memos extends React.PureComponent<MemosProps, MemosState> {
  state: MemosState = {
    memosSearchPhrase: '',
    memos: [],
    memosSearch: [],
    newMemoName: '',
    loadingMemos: true,
    searchButtonClicked: false
  }

  handleMemoSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ 
      memosSearchPhrase: event.target.value })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ 
      newMemoName: event.target.value })
  }

  onEditButtonClick = (memoId: string) => {
    this.props.history.push(`/memos/${memoId}/edit`)
  }
  
  
  onMemoSearch = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const elasticSearchMemos = await searchMemos(this.props.auth.getIdToken(), 
                                                   this.state.memosSearchPhrase)
      const localStateMemos = new Array<Memo>()

      elasticSearchMemos.forEach(foundMemo => {
        const memo = this.state.memos.find(m => m.memoId == foundMemo.memoId)
        if (memo) {
          localStateMemos.push(memo)
        }
      });

      this.setState({
        memosSearch: localStateMemos,
        memosSearchPhrase: '',
        searchButtonClicked: true
      })

    } catch {
      alert('Memo search failed')
    }
  }

  onMemoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dateCreated = dateFormat((new Date()).getDate(), 'yyyy-mm-dd') as string
      
      const newMemo = await createMemo(this.props.auth.getIdToken(), {
        memoName: this.state.newMemoName,
        createdDate: dateCreated
      })

      this.setState({
        memos: [...this.state.memos, newMemo],
        newMemoName: '',
        searchButtonClicked: false
      })
    } catch {
      alert('Memo creation failed')
    }
  }

  onMemoDelete = async (memoId: string) => {
    try {
      await deleteMemo(this.props.auth.getIdToken(), memoId)

      this.setState({
        memos: this.state.memos.filter(memo => memo.memoId != memoId),
        searchButtonClicked: false
      })
    } catch {
      alert('Memo deletion failed')
    }
  }


  async componentDidMount() {
    try {
      const memos = await getMemos(this.props.auth.getIdToken())

      this.setState({
        memos,
        loadingMemos: false
      })
    } catch (e) {
      alert(`Failed to fetch memos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">MEMOs</Header>

        {this.renderSearchMemoInput()}

        {this.renderCreateMemoInput()}

        {this.renderMemos()}
      </div>
    )
  }

  renderSearchMemoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'green',
              labelPosition: 'left',
              icon: 'search',
              content: 'Search Memos',
              onClick: this.onMemoSearch
            }}
            fluid
            actionPosition="left"
            onChange={this.handleMemoSearch}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCreateMemoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Memo',
              onClick: this.onMemoCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To remember and thrive..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderMemos() {
    if (this.state.loadingMemos) {
      return this.renderLoading()
    }

    if (this.state.searchButtonClicked) {
      return this.renderMemosSearchList()
    }
    
    return this.renderMemosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading MEMOs
        </Loader>
      </Grid.Row>
    )
  }

  renderMemosList() {
    return (
      <Grid padded>
        {this.state.memos.map((memo, pos) => {
          return (
            <Grid.Row key={memo.memoId}>
              <Grid.Column width={14} verticalAlign="middle">
                {memo.memoName}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(memo.memoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMemoDelete(memo.memoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                  {memo.photoUrl && (
                    <Image src={memo.photoUrl} size="small" wrapped />
                    )}
                  <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  renderMemosSearchList() {
    return (
      <Grid padded>
        {this.state.memosSearch.map((memo, pos) => {
          return (
            <Grid.Row key={memo.memoId}>
              <Grid.Column width={14} verticalAlign="middle">
                {memo.memoName}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(memo.memoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onMemoDelete(memo.memoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                  {memo.photoUrl && (
                    <Image src={memo.photoUrl} size="small" wrapped />
                    )}
                  <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
