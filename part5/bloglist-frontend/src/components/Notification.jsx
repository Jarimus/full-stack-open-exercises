const Notification = ({ notification }) => {
  const notificationStyle = {
    color: notification.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  if (notification.text === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {notification.text}
    </div>
  )
}

export default Notification