import { useState, useMemo } from 'react';
import { RiArrowUpSFill, RiArrowDownSFill, RiCircleFill } from "react-icons/ri";
import CompareTwoTeams from './CompareTwoTeams';
import PlayerCardHorizontal from './PlayerCardHorizontal';
import { useGetLeagueLiveTotalPointsQuery, useGetPlayersQuery } from '@/app/redux/services/fplApi';


const LeagueTable = ({ fullLeagueData, fullTeam, liveGameweek, generalInfo, leagueName, gw, leagueId, myTeamId }) => {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [showComparison, setShowComaprison] = useState(false)
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonSquads, setComparisonSquads] = useState(null)
  const [isExpanded, setExpandedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [sort, setSort] = useState({keyToSort: 'RANK', direction: 'asc'})

  const headers = [
    {
      id: 1,
      KEY: "rank_sort",
      LABEL: "Rank"
    },
    {
      id: 2,
      KEY: "entry_name",
      LABEL: "Team"
    },
    {
      id: 3,
      KEY: "live_total_points",
      LABEL: "Total"
    },
    {
      id: 4,
      KEY: "EVENT_REAL_POINTS",
      LABEL: "GW"
    },
    {
      id: 5,
      KEY: "CAPTAIN",
      LABEL: "Captain"
    },
    {
      id: 6,
      KEY: "VICE",
      LABEL: "Vice"
    },
    {
      id: 7,
      KEY: "CHIP",
      LABEL: "Chip"
    },
    {
      id: 8,
      KEY: "TRANSFER_COST",
      LABEL: "Transfer"
    },
    {
      id: 9,
      KEY: "POINTS",
      LABEL: "Pts Frm Top"
    },


  ]

  const { data: teamsLiveTotalPoints, isLoading } = useGetLeagueLiveTotalPointsQuery({ leagueId, gw }, {skip: !leagueId || !gw});
  const teams_live_points = teamsLiveTotalPoints?.teams_live_points
  const highestPoint = teamsLiveTotalPoints?.highest_live_points
  const { data: player } = useGetPlayersQuery({ leagueId, gw });
  console.log(teamsLiveTotalPoints)
  
  const players = Object.entries(player?.ownership || {}).map(([name, owners]) => ({ name, count: owners.length })).sort((a, b) => b.count - a.count);
  
  const livePointsMap = teams_live_points?.reduce((acc, team) => {
    acc[team.teamId] = team.live_total_points;
    return acc;
  }, {});

  const sortedTeams = useMemo(() => {
    if (!fullLeagueData?.standings?.results || !livePointsMap) return [];

    return [...fullLeagueData.standings.results].sort((a, b) => {
        // Get additional details from fullTeam
        const teamDetailsA = fullTeam[a.entry] || {};
        const teamDetailsB = fullTeam[b.entry] || {};
  
        // Get team names (entry_name)
        const teamNameA = a.entry_name || "Unknown";
        const teamNameB = b.entry_name || "Unknown";
  
        // Calculate event real points (GW total - transfer cost)
        const eventRealPointsA = (teamDetailsA?.picks?.reduce((total, player) => {
          const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
          return total + (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
        }, 0) || 0) - (teamDetailsA?.entry_history?.event_transfers_cost ?? 0);
  
        const eventRealPointsB = (teamDetailsB?.picks?.reduce((total, player) => {
          const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
          return total + (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
        }, 0) || 0) - (teamDetailsB?.entry_history?.event_transfers_cost ?? 0);
  
        // Get captain and vice-captain names
        const captainElementA = teamDetailsA?.picks?.find((pick) => pick.is_captain)?.element;
        const captainElementB = teamDetailsB?.picks?.find((pick) => pick.is_captain)?.element;
        const captainNameA = generalInfo?.elements?.find((player) => player.id === captainElementA)?.web_name || "Unknown";
        const captainNameB = generalInfo?.elements?.find((player) => player.id === captainElementB)?.web_name || "Unknown";
  
        const viceCaptainElementA = teamDetailsA?.picks?.find((pick) => pick.is_vice_captain)?.element;
        const viceCaptainElementB = teamDetailsB?.picks?.find((pick) => pick.is_vice_captain)?.element;
        const viceCaptainNameA = generalInfo?.elements?.find((player) => player.id === viceCaptainElementA)?.web_name || "Unknown";
        const viceCaptainNameB = generalInfo?.elements?.find((player) => player.id === viceCaptainElementB)?.web_name || "Unknown";
  
        // Get transfer cost
        const transferCostA = teamDetailsA?.entry_history?.event_transfers_cost ?? 0;
        const transferCostB = teamDetailsB?.entry_history?.event_transfers_cost ?? 0;
  
        // Sorting logic based on selected key
        switch (sort.keyToSort) {
          case "rank_sort":
          case "TOTAL":
            return sort.direction === "asc"
              ? a[sort.keyToSort] - b[sort.keyToSort]
              : b[sort.keyToSort] - a[sort.keyToSort];
  
          case "entry_name":
            return sort.direction === "asc"
              ? teamNameA.localeCompare(teamNameB)
              : teamNameB.localeCompare(teamNameA);
  
          case "live_total_points":
            const livePointsA = livePointsMap[String(a.entry)] ?? 0;
            const livePointsB = livePointsMap[String(b.entry)] ?? 0;
            return sort.direction === "asc" ? livePointsA - livePointsB : livePointsB - livePointsA;
  
          case "CAPTAIN":
            return sort.direction === "asc"
              ? captainNameA.localeCompare(captainNameB)
              : captainNameB.localeCompare(captainNameA);
  
          case "VICE":
            return sort.direction === "asc"
              ? viceCaptainNameA.localeCompare(viceCaptainNameB)
              : viceCaptainNameB.localeCompare(viceCaptainNameA);
  
          case "EVENT_REAL_POINTS":
            return sort.direction === "asc" ? eventRealPointsA - eventRealPointsB : eventRealPointsB - eventRealPointsA;
  
          case "TRANSFER_COST":
            return sort.direction === "asc" ? transferCostA - transferCostB : transferCostB - transferCostA;
  
          default:
            return 0; // No sorting if the key is not recognized
        }
      });
  }, [sort, fullLeagueData, fullTeam, liveGameweek, livePointsMap, generalInfo]);
  
  
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
  
  const ownershipPercentage = ((selectedPlayerOwners / totalManagers) * 100).toFixed(2);


  function handleHeaderClick(header) {
    setSort((prevSort) => ({
      keyToSort: header.KEY,
      direction:
        header.KEY === prevSort.keyToSort ? prevSort.direction === 'asc' ? 'desc' : 'asc' : 'desc'
    }));
  }

  if (isLoading) return <div className="justify-center items-center flex flex-col gap-4 text-center w-full text-lg bg-gray-800 text-white font-medium"><p>Loading league data...</p> <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div> </div>;;

 
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
        liveGameweek={liveGameweek}
        generalInfo={generalInfo}
        /> }
        
      </div>

      {/* TABLE SECTION  */}
      <table className="sm:min-w-[320px] w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-[#202020] text-white text-[8px] sm:text-base">
            {headers.map((header, index) => (
              <th key={index} onClick={() => handleHeaderClick(header)} className="p-2 sm:py-10 text-left sm:max-w-14 max-w-12 cursor-pointer truncate font-normal sm:font-medium" >
                <div className='flex flex-row items-center'>
                <span>{header.LABEL}</span>
                {header.KEY === sort.keyToSort && (
                  <span> {sort.direction === "asc" ? (
                    <RiArrowUpSFill color="green" />
                  ) : (
                    <RiArrowDownSFill color="red" />
                  )} </span>
                )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>

          {sortedTeams.map((team, index) => {
            const teamDetails = fullTeam[team.entry] || {};
            const captainElement = teamDetails?.picks?.find((pick) => pick.is_captain)?.element;
            const viceCaptainElement = teamDetails?.picks?.find((pick) => pick.is_vice_captain)?.element;
            const captainName = generalInfo?.elements?.find((player) => player.id === captainElement)?.web_name || "Unknown";
            const viceCaptainName = generalInfo?.elements?.find((player) => player.id === viceCaptainElement)?.web_name || "Unknown";
            const totalTeamPoints = teamDetails?.picks?.reduce((total, player) => {
              const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
              return total + (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
            }, 0) || 0;

            const eventRealPoints = totalTeamPoints - (teamDetails?.entry_history?.event_transfers_cost ?? 0);
 
            const ownsSelectedPlayer = selectedPlayer && teamDetails?.picks?.some((pick) => {
              const playerName = generalInfo?.elements?.find((p) => p.id === pick.element)?.web_name;
              return playerName === selectedPlayer;
            });

            return (
                  <>
                    <tr key={team.id} onClick={() => handleToggleTeamPlayers(team.entry)} className={` text-xs sm:text-base cursor-pointer ${ownsSelectedPlayer ? "!bg-green-200" : "odd:bg-gray-100 even:bg-white"} ${Number(myTeamId) === Number(team.entry) ? "!bg-blue-200" : "" } ` }>
                      <td  className='p-2 sm:py-10 text-left max-w-14'>
                        <div>
                          <div className='flex-col items-center'>
                            <div className='flex flex-row items-center'>
                              <p>{team.rank_sort}</p>
                              <p>
                                {team.rank_sort < team.last_rank ? (
                                  <RiArrowUpSFill color="green" size={25} />
                                ) : team.rank_sort > team.last_rank ? (
                                  <RiArrowDownSFill color="red" size={25} />
                                ) : (
                                  <RiCircleFill color="gray" size={12} />
                                )}
                              </p>
                            </div> 
                            <p className='text-xs'>[{team.last_rank}]</p> 
                          </div>
                        </div>
                      </td>
                      <td className='p-2 sm:py-10 max-w-20'> 
                        <div className="flex-col">
                          <div className="text-left text-xs sm:text-base truncate font-semibold sm:font-bold">{team.entry_name}</div>
                          <div className="text-xs sm:text-sm truncate">{team.player_name}</div> 
                        </div>
                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>
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
                      <td className='p-2 sm:py-10 text-left max-w-14'>{ livePointsMap?.[String(team.entry)] - highestPoint}</td>
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
