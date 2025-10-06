import blogServices from '../services/blogs'

const AddBlogForm = ({ blogs, setBlogs, notify }) => {

  const addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value ? event.target.author.value : undefined
    const url = event.target.url.value
    const newBlog = { title, author, url }
    const userData = JSON.parse(window.localStorage.getItem('bloglistAppUser'))
    try {
      blogServices.setToken(userData.token)
      const responseData = await blogServices.create(newBlog)
      const newBlogs = blogs.concat(responseData)
      setBlogs(newBlogs)
      notify('Blog created!', 'green', 2)
    } catch(error) {
      notify(`Please provide title and url  `, 'red', 2)
    }
  
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>Title: <input name="title" type="text" /></label>
        </div>
        <div>
          <label>Author: <input name="author" type="text" /></label>
        </div>
        <div>
          <label>Url: <input name="url" type="text" /></label>
        </div>
        <button>Create blog</button>
      </form>
    </div>
  )
}

export default AddBlogForm