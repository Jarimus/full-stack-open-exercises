import axios from 'axios'

export const getAnecdotes = async () => {
  const res = await axios.get('http://localhost:3001/anecdotes')
  return res.data
}

export const createAnecdote = async (newAnecdote) => {
  try {
    const res = await axios.post('http://localhost:3001/anecdotes', newAnecdote)
    return res.data
  } catch(error) { throw error.response.data.error };
}

export const updateAnecdote = async (anecdote) => {
  try {
    const res = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, { content: anecdote.content, votes: anecdote.votes })
    return res.data
  } catch(error) { throw error.response.data.error }
}