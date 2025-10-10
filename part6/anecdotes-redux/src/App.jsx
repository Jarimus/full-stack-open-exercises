import { useDispatch } from 'react-redux'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import VisibilityFilter from './components/VisibilityFilter'
import { useEffect } from 'react'
import { initalizeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initalizeAnecdotes())
  }, [dispatch])
  // I added dispatch to dependencies because lint told me to,
  // but I don't really understand why.

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <VisibilityFilter />
      <AnecdoteForm />
    </div>
  )
}

export default App