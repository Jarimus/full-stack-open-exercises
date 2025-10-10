import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    votes: 0
  }
}

const sortDesc = (state) => {
  return state.sort((a, b) => b.votes - a.votes)
}


const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    }
  }
})

export const { setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initalizeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(sortDesc(anecdotes)))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    const targetAnecdote = anecdotes.find(a => a.id === id)
    targetAnecdote.votes++
    const newAnecdote = await anecdoteService.updateAnecdote(id, targetAnecdote)
    const updateAnecdotes = anecdotes.map(a => a.id !== id ? a : newAnecdote)
    dispatch(setAnecdotes(sortDesc(updateAnecdotes)))
  }
}



export default anecdoteSlice.reducer