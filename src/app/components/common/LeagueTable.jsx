import { useState, useEffect, useCallback } from 'react';
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import CompareTwoTeams from './CompareTwoTeams';
import TeamHistory from './TeamHistory';
import PlayerCardHorizontal from './PlayerCardHorizontal';
import PlayerOwnership from './PlayerOwnership';
import { useGetLeagueLiveTotalPointsQuery, useGetPlayersQuery } from '@/app/redux/services/fplApi';


const LeagueTable = ({ fullLeagueData, fullTeam, liveGameweek, generalInfo, leagueName, gw, leagueId }) => {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [showComparison, setShowComaprison] = useState(false)
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonSquads, setComparisonSquads] = useState(null)
  const [isExpanded, setExpandedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const { data: teamsLiveTotalPoints } = useGetLeagueLiveTotalPointsQuery({ leagueId, gw }, {skip: !leagueId || !gw});
  const { data: player } = useGetPlayersQuery({ leagueId, gw });
  
  const players = Object.entries(player?.ownership || {})
  .map(([name, owners]) => ({ name, count: owners.length }))
  .sort((a, b) => b.count - a.count);
  
  const livePointsMap = teamsLiveTotalPoints?.reduce((acc, team) => {
    acc[team.teamId] = team.live_total_points;
    return acc;
  }, {});
  
  const handleCompareTeams = () => {
    if (team1 && team2) {
      const teamDetails1 = fullTeam[team1];
      const teamDetails2 = fullTeam[team2];
      setShowComaprison(true);
    
        setComparisonData([
          {
            label: "Rank",
            team1: fullLeagueData?.standings?.results.find((t) => t.entry === team1)?.rank || "-",
            team2: fullLeagueData?.standings?.results.find((t) => t.entry === team2)?.rank || "-",
          },
          {
            label: "Total Points",
            team1: fullLeagueData?.standings?.results.find((t) => t.entry === team1)?.total || "-",
            team2: fullLeagueData?.standings?.results.find((t) => t.entry === team2)?.total || "-",
          },
          {
            label: "GW Points",
            team1: fullLeagueData?.standings?.results?.entry_history?.points ?? "-",
            team2: fullLeagueData?.standings?.results?.entry_history?.points ?? "-",
          },
          {
            label: "Captain",
            team1:
              generalInfo?.elements?.find(
                (player) => player.id === teamDetails1?.picks?.find((p) => p.is_captain)?.element
              )?.web_name || "-",
            team2:
              generalInfo?.elements?.find(
                (player) => player.id === teamDetails2?.picks?.find((p) => p.is_captain)?.element
              )?.web_name || "-",
          },
          {
            label: "Chips Used",
            team1: teamDetails1?.active_chip || "None",
            team2: teamDetails2?.active_chip || "None",
          },
        ]);
    
        // Extract full squad details for both teams
        const team1Players = teamDetails1?.picks?.map((player) => ({
          ...player,
          playerInfo: generalInfo?.elements?.find((p) => p.id === player.element),
        })) || [];
    
        const team2Players = teamDetails2?.picks?.map((player) => ({
          ...player,
          playerInfo: generalInfo?.elements?.find((p) => p.id === player.element),
        })) || [];
        setComparisonSquads({ team1: team1Players, team2: team2Players });
      }
    };

  const handleOnclose = () => {
      setShowComaprison(false)
    }

  const handleToggleTeamPlayers = (teamId) => {
    setExpandedTeam(prev => (prev === teamId ? null : teamId));
  };

  const totalManagers = fullLeagueData?.standings?.results?.length || 1;

  const selectedPlayerOwners = fullLeagueData?.standings?.results?.filter((team) => {
    const teamPlayerIds = fullTeam[team.entry]?.picks?.map((pick) => pick.element) || [];
    const teamPlayerNames = teamPlayerIds.map((id) =>
      generalInfo?.elements?.find((p) => p.id === id)?.web_name || "Unknown"
    );
    return teamPlayerNames.some(name => name?.trim().toLowerCase() === selectedPlayer?.trim().toLowerCase());
  }).length || 0;
  
  const ownershipPercentage = ((selectedPlayerOwners / totalManagers) * 100).toFixed(2); // Convert to percentage
  
  return (
    <div className="w-full">
      
      {/* Compare Two Teams Section */}
      <div className="bg-gray-200 p-2 sm:p-4 m-2 sm:text-lg text-sm font-normal sm:font-semibold"><p>League Name: {leagueName} </p> </div>
      <div className="bg-gray-200 flex p-2 sm:p-4 m-2 gap-4 items-center">
        <h2 className="sm:text-lg text-sm font-normal sm:font-semibold">Managers who owns :</h2>
        <select onChange={(e) => setSelectedPlayer(e.target.value)} className="p-2">
          <option value="">Select a player</option>
          {players?.map((player) => (
            <option key={player.name} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <h3>{selectedPlayerOwners}/{totalManagers} = {ownershipPercentage}%</h3>
      </div>

      <div className="flex bg-gray-200 p-2 sm:p-4 m-2 items-center gap-4 mb-2">
        <h3 className="sm:text-lg text-sm font-normal sm:font-semibold">Compare:</h3>
          <div className="sm:flex flex-row gap-2 mt-2">
            <select className="border p-2" onChange={(e) => setTeam1(Number(e.target.value))}>
              <option value="">Select Team 1</option>
              {fullLeagueData?.standings?.results.map(team => (
                <option key={team.entry} value={team.entry}>{team.player_name}</option>
              ))}
            </select>
            <select className="border p-2" onChange={(e) => setTeam2(Number(e.target.value))}>
              <option value="">Select Team 2</option>
              {fullLeagueData?.standings?.results.map(team => (
                <option key={team.entry} value={team.entry}>{team.player_name}</option>
              ))}
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCompareTeams}>
              Compare
            </button>
          </div>

        {/* Display Comparison Results */}
        {showComparison && <CompareTwoTeams
        comparisonData={comparisonData}
        comparisonSquads={comparisonSquads}
        sortedData={fullLeagueData?.standings?.results}
        team1={team1}
        team2={team2}
        gw={gw}
        onClose={handleOnclose}
        fullTeam={fullTeam}
        fullLeagueData={fullLeagueData?.standings?.results}
        liveGameweek={liveGameweek}
        generalInfo={generalInfo}
        /> }
        
      </div>

      {/* TABLE SECTION  */}
      <table className="sm:min-w-[320px] w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-[#202020] text-white text-[8px] sm:text-base">
            <th> Rank </th>
            <th className="p-2 sm:py-10 text-left min-w-14 max-w-16">Team</th>
            <th className="p-2 sm:py-10 text-left w-12">Total</th>
            <th className="p-2 sm:py-10 text-left w-12">GW</th>
            <th className="p-2 sm:py-10 text-left w-12">Captain</th>
            <th className="p-2 sm:py-10 text-left w-12">Vice</th>
            <th className="p-2 sm:py-10 text-left ">Chip</th>
            <th className="p-2 sm:py-10 text-left truncate">Transfer</th>
            <th className="p-2 sm:py-10 text-left max-w-14">Pts from top</th>
          </tr>
        </thead>
        <tbody>

          {fullLeagueData?.standings?.results.map((team, index) => {
            const teamDetails = fullTeam[team.entry] || {};
            const captainElement = teamDetails?.picks?.find((pick) => pick.is_captain)?.element;
            const viceCaptainElement = teamDetails?.picks?.find((pick) => pick.is_vice_captain)?.element;
            const captainName = generalInfo?.elements?.find((player) => player.id === captainElement)?.web_name || "Unknown";
            const viceCaptainName = generalInfo?.elements?.find((player) => player.id === viceCaptainElement)?.web_name || "Unknown";
            const totalTeamPoints = teamDetails?.picks?.reduce((total, player) => {
              const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
              const eventPoints = (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
                return total + eventPoints;
              }, 0) || 0;
            const eventRealPoints = totalTeamPoints - (teamDetails?.entry_history?.event_transfers_cost ?? 0)
            
            const ownsSelectedPlayer = selectedPlayer && teamDetails?.picks?.some((pick) => {
              const playerName = generalInfo?.elements?.find((p) => p.id === pick.element)?.web_name;
              return playerName === selectedPlayer;
            });


            return (
                  <>
                    <tr key={team.id} onClick={() => handleToggleTeamPlayers(team.entry)} className={` text-xs sm:text-base cursor-pointer ${ownsSelectedPlayer ? "bg-green-200" : "odd:bg-gray-100 even:bg-white"}`}>
                      <td  className='p-2 sm:py-10 text-left max-w-14'>{index + 1}.</td>
                      <td className='p-2 sm:py-10 max-w-20'> 
                        <div className="flex-col">
                          <div className="text-left text-xs sm:text-base truncate font-semibold sm:font-bold">{team.entry_name}</div>
                          <div className="text-xs sm:text-sm truncate">{team.player_name}</div> 
                        </div>
                      </td>
                      <td  className='p-2 sm:py-10 text-left max-w-14'>
                      {livePointsMap?.[String(team.entry)] !== undefined ? (
                            livePointsMap[String(team.entry)]
                        ) : (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
                        )}

                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>{eventRealPoints}</td>
                      <td className='p-2 sm:py-10 text-left max-w-14 text-xs sm:text-sm truncate'>{captainName}</td>
                      <td className='p-2 sm:py-10 text-left  max-w-14 text-xs sm:text-sm truncate'>{viceCaptainName}</td>
                      <td className='p-2 sm:py-10 text-left'>
                        {teamDetails?.active_chip === "manager" ? "AM" :
                          teamDetails?.active_chip === "3xc" ? "TC" :
                          teamDetails?.active_chip === "wildcard" ? "WC" :
                          teamDetails?.active_chip === "freehit" ? "FH" :
                          teamDetails?.active_chip === "bboost" ? "BB" :
                          teamDetails?.active_chip}
                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>
                        {teamDetails?.entry_history?.event_transfers}({teamDetails?.entry_history?.event_transfers_cost ? `-${teamDetails.entry_history.event_transfers_cost}` : 0})
                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>HighPts</td>
                    </tr>

                    {isExpanded === team.entry && (
                      
                      <tr suppressHydrationWarning key={`expanded-${team.entry}`}>
                        <td colSpan="9" className="p-2 sm:p-8 m-2 bg-opacity-50 bg-gray-200">
                          <div className="flex flex-wrap sm:gap-6 gap-3 text-xs sm:text-sm font-medium">
                            {teamDetails?.picks?.map(player =>  {
                              const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
                              const eventPoints = (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier >= 1 ? player.multiplier : 1);
                              
                              return (
                                <PlayerCardHorizontal 
                                  key={player.element} 
                                  eventPoints={eventPoints} 
                                  player={generalInfo?.elements?.find(p => p.id === player.element)} 
                                  isCaptain={player.is_captain} 
                                  isViceCaptain={player.is_vice_captain} />
                              )
                          })}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                  );
                })}
        </tbody>
        <tfoot>
          <tr className=''>
            <td colSpan="9" className="w-full p-4 items-center justify-center text-center">
              <p>Showing result for the top {fullLeagueData.standings.results?.length} entries in the league </p>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LeagueTable;
