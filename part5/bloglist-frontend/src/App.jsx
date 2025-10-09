import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import LogoutField from './components/LogoutField'
import BlogsField from './components/BlogsField'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import CollapseExpand from './components/CollapseExpand'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({text: null, color: null})

  useEffect(() => {
    (async () => {
      const dbBlogs = await blogService.getAll()
      const sortedBlogs = dbBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })()
  }, [])

  useEffect(() => {
    const userInStorage = window.localStorage.getItem('bloglistAppUser')
    if (userInStorage) {
      setUser(JSON.parse(userInStorage))
    }
  }, [])

  const notify = (text, color, duration) => {
    setNotification({text, color})
    setTimeout(() => {
      setNotification({text: null, color: null})
    }, duration * 1000)
  }

  const collapseExpandRef = useRef()
  const createBlog = async (newBlog) => {
    const userData = JSON.parse(window.localStorage.getItem('bloglistAppUser'))
    blogService.setToken(userData.token)
    const createdBlog = await blogService.create(newBlog)
    createdBlog.user = { ...createdBlog.user, username: userData.username }
    const newBlogs = blogs.concat(createdBlog)
    setBlogs(newBlogs)
    collapseExpandRef.current.toggleView()
  }

  const removeBlog = async (id) => {
    const userData = JSON.parse(window.localStorage.getItem('bloglistAppUser'))
    blogService.setToken(userData.token)
    try {
      await blogService.remove(id)
      const updatedBlogs = blogs.filter((blog) => blog.id !== id)
      setBlogs(updatedBlogs)
    } catch {notify(`Only owner can delete blogs`, 'red', 2)}
  }

  return (
    <div>
      <h1 style={{"color": "green"}}>Blog listing</h1>
      <Notification notification={notification} />

      {!user && <LoginForm setUser={setUser} notify={notify} />}
      {user &&
      <div>
        <LogoutField user={user} setUser={setUser} notify={notify} />

        <CollapseExpand expandLabel={"Create new blog"} collapseLabel={"Cancel"} ref={collapseExpandRef} >
          <CreateBlogForm createBlog={createBlog} notify={notify} />
        </CollapseExpand>
        
        <BlogsField blogs={blogs} notify={notify} removeBlog={removeBlog} />
      </div>
      }

    </div>
  )
}

export default App