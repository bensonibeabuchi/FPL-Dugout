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
  }),
});

export const { useGetTeamQuery, useGetLeagueQuery, useGetFullTeamDetailsQuery, useGetGeneralInfoQuery } = fplApi; // Export hooks for components
