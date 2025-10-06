import loginServices from '../services/login'

const LoginForm = ({ setUser, notify }) => {

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    try {
      const user = await loginServices.login({ username, password })
      setUser(user)
      window.localStorage.setItem('bloglistAppUser', JSON.stringify(user))
      event.target.username.value = ''
      event.target.password.value = ''
      notify('Login successful!', 'green', 2)
    } catch(error) {
      event.target.password.value = ''
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
            <input name="username" type="text" />
          </label>
        </div>
        <div>
          <label>
            password
            <input name="password" type="password" />
          </label>
        </div>
        <div>
          <button>Login</button>
        </div>
      </form>
    </>
  )
}

export default LoginForm