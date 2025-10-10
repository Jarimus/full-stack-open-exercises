import { useDispatch, useSelector } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from '../reducers/notificationReducer'



const AnecdoteList = () => {

  const dispatch = useDispatch()

  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const filteredAnecdotes = anecdotes.filter(anecdote => {
    const re = new RegExp(filter, "i")
    return re.test(anecdote.content)
  })

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    const anecdote = anecdotes.find(a => a.id === id)
    dispatch(setNotification(`You voted for "${anecdote.content}"`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000);
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes} votes
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
    </div>
  )
}

export default AnecdoteList