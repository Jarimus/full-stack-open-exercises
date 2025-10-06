const LogoutField = ({ user, setUser }) => {
  return (
    <>
      <div>
        Logged in as {user.name}
      </div>
      <button onClick={() => {setUser(null)}}>Logout</button>
    </>
  )
}

export default LogoutField