import Blog from './Blog'

const BlogsField = ({ blogs }) => {
  return (
    <>
      <h2>Blogs</h2>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </>
  )
}

export default BlogsField