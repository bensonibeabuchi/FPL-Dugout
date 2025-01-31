import { configureStore } from "@reduxjs/toolkit";
import { fplApi } from "./services/fplApi"; // Base API
// import authReducer from "./slices/authSlice"; // Example of handling authentication state
import teamReducer from "./slices/teamSlice";


export const store = configureStore({
  reducer: {
    [fplApi.reducerPath]: fplApi.reducer, // Add RTK Query API reducer
    // auth: authReducer, // Other slices like user authentication
    team: teamReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fplApi.middleware), // Adds API middleware
});

export default store;
