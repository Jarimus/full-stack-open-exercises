import { useState } from "react"

const Blog = ({ blog, notify, removeBlog, updateLikes, usernameFromToken }) => {

  const [likes, setLikes] = useState(blog.likes)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLike = async () => {
    const newLikes = likes + 1
    const newData = {
      ...blog,
      likes: newLikes
    }
    setLikes(newLikes)
    updateLikes(blog, newData)
  }

  const handleRemove = async () => {
    try {
      if (window.confirm(`Remove blog "${blog.title}?`)) {
        await removeBlog(blog.id)
      }
    } catch(error) { notify(`Error deleting blog: ${error}`, 'red', 2) }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const usernameFromBlog = blog.user.username

  return (
    <div style={blogStyle}>
      {!isExpanded &&
        <div>{blog.title} - {blog.author} <button onClick={() => {setIsExpanded(true)}}>Show details</button></div>
      }

      {isExpanded && 
        <div>
          <div>{blog.title} - {blog.author} <button onClick={() => {setIsExpanded(false)}}>Hide</button></div>
          <div>{blog.url}</div>
          <div>{likes} <button onClick={handleLike}>Like</button></div>
          <div>{blog.user.username}</div>
        </div>
      }
      {isExpanded && usernameFromBlog === usernameFromToken &&
          <div><button style={{background: 'lightcoral'}} onClick={handleRemove}>Remove</button></div>
      }
    </div>
  )  
}

export default Blog