import { useState, useEffect, useCallback } from 'react';
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import CompareTwoTeams from './CompareTwoTeams';
import TeamHistory from './TeamHistory';
import PlayerCardHorizontal from './PlayerCardHorizontal';
import PlayerOwnership from './PlayerOwnership';


const LeagueTable = ({ fullLeagueData, fullTeam, liveGameweek, generalInfo, leagueName, gw, leagueId }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'asc' }); // Default sorting by rank (ascending)
  const [teamRealPoints, setTeamRealPoints] = useState({});
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [showComparison, setShowComaprison] = useState(false)
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonSquads, setComparisonSquads] = useState(null)
  const [isExpanded, setExpandedTeam] = useState(null);
  const [highestRealTotalPoints, setHighestRealTotalPoints] = useState(0);
  const [players, setPlayers] = useState([]);
  // const [ownership, setOwnership] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const handleRealTotalPointsUpdate = useCallback((teamId, realTotalPoints) => {
      setTeamRealPoints((prev) => ({ ...prev, [teamId]: realTotalPoints }));
    }, []);

  useEffect(() => {
    if (fullLeagueData?.standings?.results) {
      // Map through teams and merge realTotalPoints from state
      const updatedTeams = fullLeagueData.standings.results.map(team => ({
        ...team,
        realTotalPoints: teamRealPoints[team.entry] || 0, // Default to 0 if not found
      }));
      // Sort teams based on realTotalPoints
      setSortedData([...updatedTeams].sort((a, b) => b.realTotalPoints - a.realTotalPoints));
    }
  }, [fullLeagueData, teamRealPoints]); 

  useEffect(() => {
    if (sortedData.length > 0) {
      setHighestRealTotalPoints(Math.max(...sortedData.map(team => team.realTotalPoints || 0)));
    }
  }, [sortedData]);

  const handleCompareTeams = () => {
    if (team1 && team2) {
      const teamDetails1 = fullTeam[team1];
      const teamDetails2 = fullTeam[team2];
      setShowComaprison(true);
    
        setComparisonData([
          {
            label: "Rank",
            team1: sortedData.find((t) => t.entry === team1)?.rank || "-",
            team2: sortedData.find((t) => t.entry === team2)?.rank || "-",
          },
          {
            label: "Total Points",
            team1: sortedData.find((t) => t.entry === team1)?.total || "-",
            team2: sortedData.find((t) => t.entry === team2)?.total || "-",
          },
          {
            label: "GW Points",
            team1: teamDetails1?.entry_history?.points ?? "-",
            team2: teamDetails2?.entry_history?.points ?? "-",
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

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/players/${leagueId}/${gw}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        // setOwnership(data.ownership);
      });
  }, [leagueId, gw]);

  const totalManagers = sortedData?.length || 1; // Avoid division by zero

  const selectedPlayerOwners = sortedData?.filter((team) => {
    const teamPlayerIds = fullTeam[team.entry]?.picks?.map((pick) => pick.element) || [];
    const teamPlayerNames = teamPlayerIds.map((id) =>
      generalInfo?.elements?.find((p) => p.id === id)?.web_name || "Unknown"
    );
    return teamPlayerNames.some(name => name?.trim().toLowerCase() === selectedPlayer?.trim().toLowerCase());
  }).length || 0;
  
  const ownershipPercentage = ((selectedPlayerOwners / totalManagers) * 100).toFixed(2); // Convert to percentage


  const handleSort = () => {
    // Toggle the sorting order between 'asc' and 'desc'
    setSortConfig((prevConfig) => {
      const newOrder = prevConfig.order === 'asc' ? 'desc' : 'asc';
      return { key: 'GW', order: newOrder };
    });
  };
  
  return (
    <div className="w-full">
      
      {/* Compare Two Teams Section */}
      <div className="bg-gray-200 p-2 sm:p-4 m-2 sm:text-lg text-sm font-normal sm:font-semibold"><p>League Name: {leagueName} </p> </div>
      <div className="bg-gray-200 flex p-2 sm:p-4 m-2 gap-4 items-center">
        <h2 className="sm:text-lg text-sm font-normal sm:font-semibold">Managers who owns :</h2>
        <select onChange={(e) => setSelectedPlayer(e.target.value)} className="p-2">
          <option value="">Select a player</option>
          {players.map((player) => (
            <option key={player} value={player}>
              {player}
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
              {sortedData.map(team => (
                <option key={team.entry} value={team.entry}>{team.player_name}</option>
              ))}
            </select>
            <select className="border p-2" onChange={(e) => setTeam2(Number(e.target.value))}>
              <option value="">Select Team 2</option>
              {sortedData.map(team => (
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
        sortedData={sortedData}
        team1={team1}
        team2={team2}
        onClose={handleOnclose}
        fullTeam={fullTeam}
        fullLeagueData={fullLeagueData}
        liveGameweek={liveGameweek}
        generalInfo={generalInfo}
        /> }
        
      </div>

      {/* TABLE SECTION  */}
      <table className="sm:min-w-[320px] w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-[#202020] text-white text-[8px] sm:text-base">
            <th> Rank </th>
            <th className="p-2 sm:py-10 text-left min-w-14 max-w-32">Team</th>
            {/* <th className="p-2 sm:py-10 text-left cursor-pointer max-w-28 items-center mt-3" onClick={() => handleSort('realTotalPoints')}>Total {sortConfig.key === 'realTotalPoints' ? (sortConfig.order === 'asc' ? <RiArrowDownSFill color='red' size={20} /> : <RiArrowUpSFill color='green' size={20} />) : <RiArrowUpSFill color='green' size={20} />}</th> */}
            <th className="p-2 sm:py-10 text-left max-w-28 items-center mt-3">Total</th>
            <th className="p-2 sm:py-10 text-left cursor-pointer max-w-28 flex items-center mt-3" onClick={handleSort}>
              GW {sortConfig.order === 'asc' ? <RiArrowDownSFill color='red' size={20} /> : <RiArrowUpSFill color='green' size={20} />}
            </th>

            <th className="p-2 sm:py-10 text-left  w-12">Captain</th>
            <th className="p-2 sm:py-10 text-left w-12">Vice</th>
            <th className="p-2 sm:py-10 text-left ">Chip</th>
            <th className="p-2 sm:py-10 text-left truncate">Hits</th>
            <th className="p-2 sm:py-10 text-left max-w-14">Points from top</th>
          </tr>
        </thead>
        <tbody>

          {sortedData?.sort((a,b) =>b.realTotalPoints - a.realTotalPoints).map((team, index) => {
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
                      <td className='p-2 sm:py-10'> 
                        <div className="flex-col">
                          <div className="text-left font-semibold sm:font-bold">{team.entry_name}</div>
                          <div className="text-sm">{team.player_name}</div> 
                        </div>
                      </td>
                      <td  className='p-2 sm:py-10 text-left max-w-14'>
                        <TeamHistory 
                          eventRealPoints={eventRealPoints}
                          teamId={team.entry}
                          onRealTotalPointsUpdate={handleRealTotalPointsUpdate} 
                        /> 
                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>{eventRealPoints}</td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>{captainName}</td>
                      <td className='p-2 sm:py-10 text-left  max-w-14 truncate'>{viceCaptainName}</td>
                      <td className='p-2 sm:py-10 text-left'>
                        {teamDetails?.active_chip === "manager" ? "AM" :
                          teamDetails?.active_chip === "3xc" ? "TC" :
                          teamDetails?.active_chip === "wildcard" ? "WC" :
                          teamDetails?.active_chip === "freehit" ? "FH" :
                          teamDetails?.active_chip === "bboost" ? "BB" :
                          teamDetails?.active_chip}
                      </td>
                      <td className='p-2 sm:py-10 text-left  max-w-14'>
                        {teamDetails?.entry_history?.event_transfers}({teamDetails?.entry_history?.event_transfers_cost ? `-${teamDetails.entry_history.event_transfers_cost}` : 0})
                      </td>
                      <td className='p-2 sm:py-10 text-left max-w-14'>{teamRealPoints[team.entry] !== undefined ? teamRealPoints[team.entry] - highestRealTotalPoints : ""}</td>
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
