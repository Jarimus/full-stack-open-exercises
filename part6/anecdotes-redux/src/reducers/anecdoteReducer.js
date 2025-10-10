import { createSlice } from '@reduxjs/toolkit'

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
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const targetAnecdote = state.find(a => a.id === id)
      targetAnecdote.votes++
      return sortDesc(state)
    }
  }
})


export const { createAnecdote, voteAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer