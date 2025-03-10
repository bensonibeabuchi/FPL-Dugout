import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fplApi = createApi({
  reducerPath: "fplApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000/api/" }),
  // baseQuery: fetchBaseQuery({ baseUrl: "https://fpl-dugout-backend-deploment.up.railway.app/api/" }),
  endpoints: (builder) => ({
    getTeam: builder.query({
      query: (teamId) => `team/${teamId}/`,
    }),
    getLeague: builder.query({
      query: ({ leagueId, page }) => `league/classic/${leagueId}/`
    }),
    getFullTeamDetails: builder.query({
      query: ({ teamId, gw }) => `team/${teamId}/event/${gw}/picks/`
    }),
    getGeneralInfo: builder.query({
      query: () => `general-info/`
    }),
    getPlayerPhoto: builder.query({
      query: ({ opta_code }) => `/player/${opta_code}`,
      transformResponse: (response) => response?.url ?? "", // Extract only the image URL
    }),
    getLiveGameweekData: builder.query({
      query: ({ event_id }) => `/gameweek/${event_id}/live/`,
    }),
    getTeamHistory: builder.query({
      query: ({teamId}) => `team/${teamId}/history/`
    }),
    geth2hLeague: builder.query({
      query: ({ leagueId }) => `league/h2h/${leagueId}/`
    }),
    getTeamEVentPoints: builder.query({
      query: ({teamId, gw}) => `team/${teamId}/${gw}/points/`,
    }),
    getTeamLiveTotalPoints: builder.query({
      query: ({teamId, gw}) => `team/${teamId}/${gw}/live-total-points/`,
    }),
    getLeagueLiveTotalPoints: builder.query({
      query: ({leagueId, gw}) => `league/${leagueId}/live-points/?gw=${gw}`,
    }),
    getPlayers: builder.query({
      query: ({leagueId, gw}) => `players/${leagueId}/${gw}`,
    })


    
  }),
});

export const { useGetTeamQuery,useGetPlayersQuery, useGetLeagueLiveTotalPointsQuery, useGetTeamLiveTotalPointsQuery, useGetTeamEVentPointsQuery, useGeth2hLeagueQuery, useGetLeagueQuery, useGetFullTeamDetailsQuery, useGetGeneralInfoQuery, useGetPlayerPhotoQuery, useGetLiveGameweekDataQuery, useGetTeamHistoryQuery } = fplApi; // Export hooks for components
