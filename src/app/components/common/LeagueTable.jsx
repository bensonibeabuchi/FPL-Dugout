import { useState, useEffect } from 'react';
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";
import CompareTwoTeams from './CompareTwoTeams';

const LeagueTable = ({ fullLeagueData, fullTeam, liveGameweek, generalInfo }) => {
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'rank', order: 'asc' }); // Default sorting by rank (ascending)
    const [team1, setTeam1] = useState(null);
    const [team2, setTeam2] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [showComparison, setShowComaprison] = useState(false)
    const [comparisonSquads, setComparisonSquads] = useState(null)

  
    useEffect(() => {
      if (fullLeagueData?.standings?.results) {
        setSortedData(fullLeagueData.standings.results);
      }
    }, [fullLeagueData]);
  
    const handleSort = (key) => {
      const newOrder = sortConfig.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
  
      setSortedData((prevData) =>
        [...prevData].sort((a, b) => {
          let valueA, valueB;
  
          if (key === 'rank') {
            valueA = a.rank;
            valueB = b.rank;
          } else if (key === 'GW') {
            const teamDetailsA = fullTeam[a.entry] || {};
            const teamDetailsB = fullTeam[b.entry] || {};
  
            const totalTeamPointsA = teamDetailsA?.picks?.reduce((total, player) => {
              const matchedPlayerPoints = liveGameweek?.elements?.find((e) => e.id === player.element);
              return total + (matchedPlayerPoints?.stats?.total_points ?? 0) * (player.multiplier ?? 1);
            }, 0) || 0;
  
            const totalTeamPointsB = teamDetailsB?.picks?.reduce((total, player) => {
              const matchedPlayerPoints = liveGameweek?.elements?.find((e) => e.id === player.element);
              return total + (matchedPlayerPoints?.stats?.total_points ?? 0) * (player.multiplier ?? 1);
            }, 0) || 0;
  
            valueA = totalTeamPointsA - (teamDetailsA?.entry_history?.event_transfers_cost ?? 0);
            valueB = totalTeamPointsB - (teamDetailsB?.entry_history?.event_transfers_cost ?? 0);
          }
  
          return newOrder === 'asc' ? valueA - valueB : valueB - valueA;
        })
      );
  
      setSortConfig({ key, order: newOrder });
    };

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

  return (
    <div className="w-full">
      
      {/* Compare Two Teams Section */}
      <div className="flex items-center gap-4 mb-2">
        <h3 className="text-lg font-semibold">Compare Two Teams:</h3>
          <div className="flex space-x-4 mt-2">
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
      <table className="sm:min-w-[320px] w-full border border-gray-300 table-fixed">
        <thead>
          <tr className="bg-[#202020] text-white text-xs sm:text-base">
          <th
              className="p-2 sm:py-10 text-left cursor-pointer max-w-28 flex items-center mt-3"
              onClick={() => handleSort('rank')}
            >
              Rank {sortConfig.key === 'rank' ? (sortConfig.order === 'asc' ? <><RiArrowUpSFill color='green' size={20} /></> : <><RiArrowDownSFill color='red' size={20} /></>) : ''}
              </th>
            <th className="p-2 sm:py-10 text-left">Team</th>
            <th className="p-2 sm:py-10 text-left">Total</th>
            <th
              className="p-2 sm:py-10 text-left cursor-pointer max-w-28 flex items-center mt-3"
              onClick={() => handleSort('GW')}
            >
              GW {sortConfig.key === 'GW' ? (sortConfig.order === 'asc' ? <><RiArrowDownSFill color='red' size={20} /></> : <><RiArrowUpSFill color='green' size={20} /></>) : ''}
              </th>
            <th className="p-2 sm:py-10 text-left">Captain</th>
            <th className="p-2 sm:py-10 text-left hidden sm:table-cell">Vice</th>
            <th className="p-2 sm:py-10 text-left">Chip</th>
            <th className="p-2 sm:py-10 text-left hidden sm:table-cell">Transfers</th>
            <th className="p-2 sm:py-10 text-left max-w-14">Points from top</th>
          </tr>
        </thead>
        <tbody>
          {sortedData?.map((team) => {
            const teamDetails = fullTeam[team.entry] || {};
            const captainElement = teamDetails?.picks?.find((pick) => pick.is_captain)?.element;
            const viceCaptainElement = teamDetails?.picks?.find((pick) => pick.is_vice_captain)?.element;
            const captainName = generalInfo?.elements?.find((player) => player.id === captainElement)?.web_name || "Unknown";
            const viceCaptainName = generalInfo?.elements?.find((player) => player.id === viceCaptainElement)?.web_name || "Unknown";
            const highestPoints = Math.max(...fullLeagueData?.standings?.results?.map((t) => t.total) || [0]);

            // Calculate total team points
            const totalTeamPoints = teamDetails?.picks?.reduce((total, player) => {
                const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
                const eventPoints = (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
                return total + eventPoints;
            }, 0) || 0;
            const eventRealPoints = totalTeamPoints - (teamDetails?.entry_history?.event_transfers_cost ?? 0)
            
            return (
              <tr key={team.entry} className="odd:bg-gray-100 even:bg-white text-[10px] sm:text-sm">
                <td className='p-2 sm:py-10 text-left max-w-14'>{team.rank}</td>
                <td className='p-2 sm:py-10 text-left max-w-20 font-semibold sm:font-bold'>{team.player_name}</td>
                <td className='p-2 sm:py-10 text-left max-w-14'>{team.total}</td>
                <td className='p-2 sm:py-10 text-left max-w-14'>{eventRealPoints}</td>
                <td className='p-2 sm:py-10 text-left max-w-14'>{captainName}</td>
                <td className='p-2 sm:py-10 text-left hidden sm:table-cell max-w-20'>{viceCaptainName}</td>
                <td className='p-2 sm:py-10 text-left'>
                  {teamDetails?.active_chip === "manager" ? "AM" :
                    teamDetails?.active_chip === "3xc" ? "TC" :
                    teamDetails?.active_chip === "wildcard" ? "WC" :
                    teamDetails?.active_chip === "freehit" ? "FH" :
                    teamDetails?.active_chip === "bboost" ? "BB" :
                    teamDetails?.active_chip}
                </td>
                <td className='p-2 sm:py-10 text-left hidden sm:table-cell max-w-14'>
                  {teamDetails?.entry_history?.event_transfers}({teamDetails?.entry_history?.event_transfers_cost ? `-${teamDetails.entry_history.event_transfers_cost}` : 0})
                </td>
                <td className='p-2 sm:py-10 text-left max-w-14'>{teamDetails?.entry_history?.total_points - highestPoints}</td>
              </tr>
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
