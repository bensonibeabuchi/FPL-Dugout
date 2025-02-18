import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fplApi = createApi({
  reducerPath: "fplApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: (teamId) => `team/${teamId}/`,
    }),
    getLeague: builder.query({
      query: ({ leagueId, page }) => `league/classic/${page}/${leagueId}/`
    }),
    getFullTeamDetails: builder.query({
      query: ({ teamId, gw }) => `team/${teamId}/event/${gw}/picks/`
    }),
    getGeneralInfo: builder.query({
      query: () => `general-info/`
    }),
    getPlayerPhoto: builder.query({
      query: ({ opta_code }) => `/player/${opta_code}`,
      transformResponse: (response) => response?.url ?? "", // ✅ Extract only the image URL
    }),
    getLiveGameweekData: builder.query({
      query: ({ event_id }) => `/gameweek/${event_id}/live/`,
    }),
    
    
    
  }),
});

export const { useGetTeamQuery, useGetLeagueQuery, useGetFullTeamDetailsQuery, useGetGeneralInfoQuery, useGetPlayerPhotoQuery, useGetLiveGameweekDataQuery } = fplApi; // Export hooks for components
