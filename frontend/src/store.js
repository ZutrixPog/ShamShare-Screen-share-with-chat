import { configureStore } from '@reduxjs/toolkit'
import nameSlicer from './redux/slicers/nameSlicer';
import socketReducer from './redux/slicers/socketSlicer';

export default configureStore({
  reducer: {
      socket: socketReducer,
      name: nameSlicer,
  },
})