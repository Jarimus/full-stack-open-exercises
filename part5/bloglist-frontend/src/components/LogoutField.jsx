const LogoutField = ({ user, setUser, notify }) => {
  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('bloglistAppUser')
    notify('Logged out', 'green', 2)     
  }

  return (
    <>
      <div>
        Logged in as {user.name}
      </div>
      <button onClick={logout}>Logout</button>
    </>
  )
}

export default LogoutField