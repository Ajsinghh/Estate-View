import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSilce";

 const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
   return  getDefaultMiddleware({
      serializableCheck: false,
    })
  },
});
export {store}
