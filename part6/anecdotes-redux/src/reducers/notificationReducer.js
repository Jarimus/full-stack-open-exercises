import { createSlice } from '@reduxjs/toolkit'

const initialState = "Hello and welcome!"

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(_, action) {
      return action.payload
    },
    clearNotification() {
      return ""
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer

export const showNotification = (message, time) => {
  return (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, time * 1000);
  }
}