import { useEffect, useState } from "react";

export default function PlayerOwnership({ leagueId, gameweek }) {
  const [players, setPlayers] = useState([]);
  const [ownership, setOwnership] = useState({});
  const [selectedPlayer, setSelectedPlayer] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/players/${leagueId}/${gameweek}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        setOwnership(data.ownership);
      });
  }, [leagueId, gameweek]);

  return (
    <div>
      <h2>Player Ownership in League</h2>
      <select onChange={(e) => setSelectedPlayer(e.target.value)}>
        <option value="">Select a player</option>
        {players.map((player) => (
          <option key={player} value={player}>
            {player}
          </option>
        ))}
      </select>

      {selectedPlayer && (
        <div>
          <h3>Managers with {selectedPlayer}:</h3>
          <ul>
            {ownership[selectedPlayer]?.map((manager) => (
              <li key={manager}>{manager}</li>
            )) || <p>No managers own this player.</p>}
          </ul>
        </div>
      )}
    </div>
  );
}
