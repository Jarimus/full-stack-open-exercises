import loginServices from '../services/login'

const LoginForm = ({ setUser }) => {

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    console.log(`${username}: ${password}`)
    try {
      const user = await loginServices.login({ username, password })
      setUser(user)
      console.log(user)
      event.target.username.value = ''
      event.target.password.value = ''
    } catch(error) {
      console.error(`wrong credentials or error: ${error}`)
      event.target.password.value = ''
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