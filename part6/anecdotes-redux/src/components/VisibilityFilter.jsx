import { setFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const VisibilityFilter = () => {

  const dispatch = useDispatch()

  return (
    <div>
      <label>
        filter anecdotes: 
          <input name='input' type="text" onChange={({ target }) => dispatch(setFilter(target.value))} />
      </label>
    </div>
  )
}

export default VisibilityFilter