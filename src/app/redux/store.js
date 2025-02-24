import { configureStore } from "@reduxjs/toolkit";
import { fplApi } from "./services/fplApi"; 
import teamReducer from "./slices/teamSlice";


export const store = configureStore({
  reducer: {
    [fplApi.reducerPath]: fplApi.reducer, 
    team: teamReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fplApi.middleware), 
});

export default store;
