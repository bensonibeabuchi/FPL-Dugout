import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teamId: localStorage.getItem("teamId") || "",
    teamData: null, // Store fetched team data
    page: 1
  },
  reducers: {
    setTeamData: (state, action) => {
      state.teamData = action.payload;
    },
    setTeamId: (state, action) => {
      state.teamId = action.payload;
      localStorage.setItem("teamId", action.payload);
    },
  },
});

export const { setTeamData, setTeamId } = teamSlice.actions;
export default teamSlice.reducer;
