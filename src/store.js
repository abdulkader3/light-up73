import { configureStore } from '@reduxjs/toolkit'
import shanto from './Slices/Redux'

export default configureStore({
  reducer: {
    prity: shanto,
  },
})
