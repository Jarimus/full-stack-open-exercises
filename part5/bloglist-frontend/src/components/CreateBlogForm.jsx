import { useState } from "react"

const CreateBlogForm = ({ createBlog, notify }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newBlog = { title, url }
    newBlog.author = author === '' ? undefined : author // to activate a backend default value using 'undefined'
    try {
      await createBlog(newBlog)
      notify('Blog created!', 'green', 2)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error)
      const errorMsg = error.response.data.error
      if (!errorMsg) {
        notify('Unknown error creating blog', 'red', 2)
      } else if (errorMsg.includes('Blog validation')) {
        notify(`Please provide a title and a url.`, 'red', 2)
      } else {
        notify(errorMsg, 'red', 2)
      }
    }
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: <input value={title} type="text" onChange={({target}) => {setTitle(target.value)}} /></label>
        </div>
        <div>
          <label>Author: <input value={author} type="text" onChange={({target}) => {setAuthor(target.value)}} /></label>
        </div>
        <div>
          <label>Url: <input value={url} type="text" onChange={({target}) => {setUrl(target.value)}} /></label>
        </div>
        <button name="create blog" >Create blog</button>
      </form>
    </div>
  )
}

export default CreateBlogForm