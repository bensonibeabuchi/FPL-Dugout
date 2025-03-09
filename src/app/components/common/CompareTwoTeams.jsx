import { IoIosCloseCircle } from "react-icons/io";
import PlayerCardLine from "./PlayerCardLine";
import { useGetTeamLiveTotalPointsQuery } from "@/app/redux/services/fplApi";

const CompareTwoTeams = ({onClose, comparisonSquads, sortedData, team1, team2, gw, fullTeam, liveGameweek, generalInfo}) => {

    const captainElement = fullTeam[team1]?.picks?.find(pick => pick.is_captain)?.element;
    const captainElement2 = fullTeam[team2]?.picks?.find(pick => pick.is_captain)?.element;
    const captainName = generalInfo?.elements?.find(player => player.id === captainElement)?.web_name || "Unknown Player";
    const captainName2 = generalInfo?.elements?.find(player => player.id === captainElement2)?.web_name || "Unknown Player";
    const active_chip1 = fullTeam[team1]?.active_chip || "None";  // Default to "None" if no active chip is found
    const active_chip2 = fullTeam[team2]?.active_chip || "None";  // Default to "None" if no active chip is found

    const startingPlayers = fullTeam[team1]?.picks?.filter(player => player.position >= 1 && player.position <= 11) || [];
    const position16Player = fullTeam[team1]?.picks?.find(player => player.position === 16);
    const startingPlayers2 = fullTeam[team2]?.picks?.filter(player => player.position >= 1 && player.position <= 11) || [];
    const position16Player2 = fullTeam[team2]?.picks?.find(player => player.position === 16);

    // Combine both into one array
    const selectedPlayers = position16Player ? [...startingPlayers, position16Player] : startingPlayers;
    const selectedPlayers2 = position16Player ? [...startingPlayers2, position16Player2] : startingPlayers2;


    const gwLivePoints = selectedPlayers.reduce((total, player) => {
        const matchedPlayer = liveGameweek?.elements?.find(element => element.id === player.element);
        return total + ((matchedPlayer?.stats.total_points ?? 0) * (player.multiplier || 1));
    }, 0) || "-";

    const gwLivePoints2 = selectedPlayers2.reduce((total, player) => {
        const matchedPlayer = liveGameweek?.elements?.find(element => element.id === player.element);
        return total + ((matchedPlayer?.stats.total_points ?? 0) * (player.multiplier || 1));
    }, 0) || "-";
    
    const transferCost = fullTeam[team1]?.entry_history?.event_transfers_cost ?? "0"
    const transferCost2 = fullTeam[team2]?.entry_history?.event_transfers_cost ?? "0"

    // Extract team player lists
    const team1Players = fullTeam[team1]?.picks || [];
    const team2Players = fullTeam[team2]?.picks || [];

    // Extract only element IDs for comparison
    const team1Elements = team1Players.map(player => player.element);
    const team2Elements = team2Players.map(player => player.element);

    // Find common players (players in both teams based on element ID)
    const commonPlayers = team1Players.filter(player => team2Elements.includes(player.element));
    const commonPlayers2 = team2Players.filter(player => team1Elements.includes(player.element));

    // Find different players (players only in each team)
    const differentPlayers1 = team1Players.filter(player => !team2Elements.includes(player.element));
    const differentPlayers2 = team2Players.filter(player => !team1Elements.includes(player.element));

    // Combine them so that the different players appear first, followed by common players
    const sortedPlayers1 = [...differentPlayers1, ...commonPlayers].map(player => ({
        ...player,
        playerInfo: generalInfo?.elements?.find(p => p.id === player.element) || {},
    }));

    const sortedPlayers2 = [...differentPlayers2, ...commonPlayers2].map(player => ({
        ...player,
        playerInfo: generalInfo?.elements?.find(p => p.id === player.element) || {},
    }));

    const { data: teamsLiveTotalPoints } = useGetTeamLiveTotalPointsQuery({ teamId: team1, gw: gw });
    const liveTotalPoints = teamsLiveTotalPoints?.live_total_points

    const { data: teamsLiveTotalPoints2 } = useGetTeamLiveTotalPointsQuery({ teamId: team2, gw: gw });
    const liveTotalPoints2 = teamsLiveTotalPoints2?.live_total_points

return (
<div
    className="fixed z-20 top-0 h-screen w-screen left-0 bg-black bg-opacity-50 flex items-center justify-center mx-auto backdrop-blur-sm">
    <div className='bg-white rounded-md w-[584px] h-fit p-8'>
        <div className="flex justify-between items-center">
            <p>Compare two teams together</p>
            <button onClick={onClose} className="bg-red-500 rounded-full">
                <IoIosCloseCircle size={24} color='white' />
            </button>
        </div>

        {comparisonSquads && (
        
        <div className="grid grid-cols-2 gap-4 mt-6">
            {/* Team 1 Squad */}
            <div>
                <h3 className="font-semibold">{sortedData.find((t) => t.entry === team1)?.player_name}</h3>
                <h3 className="font-medium">Total: {liveTotalPoints} </h3>
                <h3 className="font-medium">GW: {gwLivePoints-transferCost} </h3>

                <p>Captain: {captainName}</p>
                <p>Chip: {active_chip1 === "manager" ? "Asst Manager" :
                    active_chip1 === "3xc" ? "Triple Captain" :
                    active_chip1 === "wildcard" ? "Wildcard" :
                    active_chip1 === "freehit" ? "Free Hit" :
                    active_chip1 === "bboost" ? "Bench Boost" :
                    active_chip1}</p>

                <div className="border p-4 rounded">
                    {sortedPlayers1.map((player) => {
                        const isCommon = commonPlayers.some(commonPlayer => commonPlayer.element === player.element);
                            return (
                                <div key={player.element} className={`flex items-center justify-between ${isCommon ? "bg-gray-100 text-gray-300" : ""}`}>
                                <PlayerCardLine
                                key={player.element} 
                                player={player.playerInfo}
                                isCaptain={player.is_captain}
                                isViceCaptain={player.is_vice_captain}
                                eventPoints={player.stats?.total_points}
                                />
                            <p>{(player.playerInfo?.event_points ?? 0) * (player.multiplier === 0 ? 1 : player.multiplier)}</p>
                        </div>
                        )
                    })}
                </div>
            </div>

            {/* Team 2 Squad */}
            <div>
                <h3 className="font-semibold">{sortedData.find((t) => t.entry === team2)?.player_name}</h3>
                <h3 className="font-medium">Total: {liveTotalPoints2} </h3>
                <h3 className="font-medium">GW: {gwLivePoints2-transferCost2} </h3>
                <p>Captain: {captainName2}</p>
                <p>Chip: {active_chip2 === "manager" ? "Asst Manager" :
                    active_chip2 === "3xc" ? "TC" :
                    active_chip2 === "wildcard" ? "WC" :
                    active_chip2 === "freehit" ? "FH" :
                    active_chip2 === "bboost" ? "BB" :
                    active_chip2}</p>

                <div className="border p-4 rounded">
                    {sortedPlayers2.map((player) => {
                        const isCommon = commonPlayers.some(commonPlayer => commonPlayer.element === player.element);
                     
                        return (
                            <div key={player.element} className={`flex items-center justify-between ${isCommon ? "bg-gray-100 text-gray-300" : ""}`}>
                                <PlayerCardLine key={player.element} player={player.playerInfo} isCaptain={player.is_captain} isViceCaptain={player.is_vice_captain} eventPoints={player.stats?.total_points} />
                            <p>{(player.playerInfo?.event_points ?? 0) * (player.multiplier === 0 ? 1 : player.multiplier)}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
        )}

    </div>

</div>
)
}

export default CompareTwoTeams