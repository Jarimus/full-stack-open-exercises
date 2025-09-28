import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL
console.log("frontend uses baseurl:", baseUrl)

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