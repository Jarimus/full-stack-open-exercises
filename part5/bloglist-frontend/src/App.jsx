import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import LogoutField from './components/LogoutField'
import BlogsField from './components/BlogsField'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({text: null, color: null})

  const notify = (text, color, duration) => {
    setNotification({text, color})
    setTimeout(() => {
      setNotification({text: null, color: null})
    }, duration * 1000)
  }

  useEffect(() => {
    const userInStorage = window.localStorage.getItem('bloglistAppUser')
    if (userInStorage) {
      setUser(JSON.parse(userInStorage))
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  return (
    <div>
      <h1 style={{"color": "green"}}>Blog listing</h1>
      <Notification notification={notification} />

      {!user && <LoginForm setUser={setUser} notify={notify} />}
      {user &&
      <div>
        <LogoutField user={user} setUser={setUser} notify={notify} />
        <AddBlogForm blogs={blogs} setBlogs={setBlogs} notify={notify} />
        <BlogsField blogs={blogs} />
      </div>
      }

    </div>
  )
}

export default App