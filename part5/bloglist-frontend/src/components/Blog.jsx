import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, notify, removeBlog }) => {

  const usernameFromBlog = blog.user.username
  const usernameFromToken = JSON.parse(window.localStorage.getItem('bloglistAppUser')).username

  const [likes, setLikes] = useState(blog.likes)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLike = async () => {
    const newLikes = likes + 1
    const newData = {
      ...blog,
      likes: newLikes
    }
    try {
      blogService.update(blog.id, newData)
      setLikes(newLikes)
    } catch(error) { notify(`Error updating like: ${error}`, 'red', 2) }

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



  return (
    <div style={blogStyle}>
      {!isExpanded &&
        <div>{blog.title} - {blog.author} <button onClick={() => {setIsExpanded(true)}}>Show details</button></div>
      }

      {isExpanded && 
        <div>
          <div>{blog.title} <button onClick={() => {setIsExpanded(false)}}>Hide</button></div>
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