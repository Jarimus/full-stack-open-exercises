const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (!authorization) {
    return null
  }
  const parts = authorization.split(" ", 2)
  if (parts[0] === 'Bearer') {
    return parts[1]
  }
  return null
}

module.exports = { getTokenFrom }