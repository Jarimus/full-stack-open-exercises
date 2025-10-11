import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {

  const queryClient = new QueryClient()
  const notificationDispatch = useNotificationDispatch()

  const updateVotesMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      notificationDispatch({ type: "SET", payload: `${error}` })
    }
  })

  const handleVote = (anecdote) => {
    anecdote.votes++
    updateVotesMutation.mutate( anecdote )
    notificationDispatch({ type: "SET", payload: `Voted "${anecdote.content}"`})
    setTimeout(() => {
      notificationDispatch({ type: "RESET" })
    }, 5000);
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  if (result.isLoading) {
    return (
      <div>
        <h3>Anecdotes</h3>
        <div>Loading anecdotes...</div>
      </div>
    )
  }

  if (result.isError) {
    return (
      <div>anecdote service unavailable due to problems in server: {result.error.message}</div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
