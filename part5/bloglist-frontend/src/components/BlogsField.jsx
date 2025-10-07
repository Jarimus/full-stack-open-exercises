import Blog from './Blog'

const BlogsField = ({ blogs, notify, removeBlog }) => {
  return (
    <>
      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} notify={notify} removeBlog={removeBlog} />)}
    </>
  )
}

export default BlogsField