import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fplApi = createApi({
  reducerPath: "fplApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: (teamId) => `team/${teamId}/`,
    }),
    getLeague: builder.query({
      query: ({ leagueId, page },) => `league/${page}/${leagueId}/`
    }),
  }),
});

export const { useGetTeamQuery, useGetLeagueQuery } = fplApi; // Export hooks for components
