import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import LogoutField from './components/LogoutField'
import BlogsField from './components/BlogsField'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>

      {!user && <LoginForm setUser={setUser} />}
      {user &&
      <div>
        <LogoutField user={user} setUser={setUser} />
        <BlogsField blogs={blogs} />
      </div>
      }

    </div>
  )
}

export default App