import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teamId: "",
  teamData: null,
  page: 1,
};

// Ensure `localStorage` is accessed only on the client side
if (typeof window !== "undefined") {
  initialState.teamId = localStorage.getItem("teamId") || "";
}

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    setTeamId: (state, action) => {
      state.teamId = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("teamId", action.payload);
      }
    },
  },
});

export const { setTeamData, setTeamId } = teamSlice.actions;
export default teamSlice.reducer;
