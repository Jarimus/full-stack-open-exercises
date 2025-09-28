import axios from 'axios'

const PORT_BACKEND = process.env.PORT | 3001
const baseUrl = `http://localhost:${PORT_BACKEND}/api/persons`

const getAll = () => {
  const promise = axios.get(baseUrl)
  return promise.then(res => res.data)
}

const create = (newEntry) => {
  const promise = axios.post(baseUrl, newEntry)
  return promise.then(res => res.data)
}

const put = (id, updatedEntry) => {
  const promise = axios.put(`${baseUrl}/${id}`, updatedEntry)
  return promise.then(res => res.data)
}

const deletePerson = (id) => {
  const promise = axios.delete(`${baseUrl}/${id}`)
  return promise.then(res => res.data)
}

export default { getAll, create, put, deletePerson }