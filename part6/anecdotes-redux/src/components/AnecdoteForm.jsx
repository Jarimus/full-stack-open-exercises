import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const create = async (e) => {
    e.preventDefault()
    const content = e.target.content.value
    if (content === "") {
      return
    }
    dispatch(createAnecdote(content))
    e.target.content.value = ""
    dispatch(showNotification(`Anecdote "${content}" created!`, 5))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='content' /></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm