import { useState } from 'react'
import loginServices from '../services/login'

const LoginForm = ({ setUser, notify }) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginServices.login({ username, password })
      setUser(user)
      window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      notify('Login successful!', 'green', 2)
    } catch {
      setPassword('')
      notify('Username or password wrong', 'red', 2)
    }
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <h2>Log in to the application</h2>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({target}) => {setUsername(target.value)}} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({target}) => {setPassword(target.value)}} />
          </label>
        </div>
        <div>
          <button name='login' style={{ margin: "10px 0" }}>Login</button>
        </div>
      </form>
    </>
  )
}

export default LoginForm