import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
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