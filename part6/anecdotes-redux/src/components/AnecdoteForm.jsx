import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const create = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    if (content === "") {
      return
    }
    dispatch(createAnecdote(content))
    dispatch(setNotification(`Note "${content}" created!`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000);
    e.target.content.value = ""
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