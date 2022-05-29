import {configureStore} from '@reduxjs/toolkit';
import {profileReducer} from "./features/profile/profile-slice"

export const store = configureStore({
  reducer: {
     profile: profileReducer
  },
  devTools: true,
  middleware: (getDefaultMiddlware) => getDefaultMiddlware({
    thunk: {
      extraArgument: {
      },
    },
    serializableCheck: false,
  })
});