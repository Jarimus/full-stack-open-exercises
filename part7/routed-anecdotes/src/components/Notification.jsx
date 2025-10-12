const Notification = ({ notification }) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    margin: '10px 0'
  }

  if (notification === "") {
    return null
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification