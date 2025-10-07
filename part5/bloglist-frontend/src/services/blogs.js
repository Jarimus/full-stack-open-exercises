import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (value) => {
  token = `Bearer ${value}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

const update = async (id, newData) => {
  const response = axios.put(`${baseUrl}/${id}`, newData)
  return response.data
}

export default { getAll, create, remove, update, setToken }