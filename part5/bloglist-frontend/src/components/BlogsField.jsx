import Blog from './Blog'
import blogService from '../services/blogs'

const BlogsField = ({ blogs, notify, removeBlog }) => {

  const usernameFromToken = JSON.parse(window.localStorage.getItem('bloglistAppUser')).username

  const updateLikes = async (blog, newData) => {
    try {
      blogService.update(blog.id, newData)
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