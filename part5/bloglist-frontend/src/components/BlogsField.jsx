import Blog from './Blog'
import blogService from '../services/blogs'

const BlogsField = ({ blogs, notify, removeBlog, setBlogs }) => {

  const usernameFromToken = JSON.parse(window.localStorage.getItem('bloglistAppUser')).username

  const updateLikes = async (blog, newData) => {
    try {
      await blogService.update(blog.id, newData)
      const newBlogs = blogs.map(b => b.id !== blog.id ? b : {...blog, likes: blog.likes + 1})
      setBlogs(newBlogs.sort((a,b) => b.likes - a.likes ))
    } catch(error) { notify(`Error updating like: ${error}`, 'red', 2) }
  }

  return (
    <>
      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} notify={notify} removeBlog={removeBlog} updateLikes={updateLikes} usernameFromToken={usernameFromToken} />)}
    </>
  )
}

export default BlogsField