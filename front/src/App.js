import './App.css';
import React, { useState } from 'react';
import configs from './configs';
import SoccerPlayersList from './SoccerPlayersList';
import SoccerMatchesList from './SoccerMatchesList';

function App() {
  const columnStyle = {
    display: 'flex',
    width: '100%',
  };

  const halfWidth = {
    flex: '0 0 50%',
  };

  const [selectedTeam, setSelectedTeam] = useState('');

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  return (
    <div className="App">
      <h1>Blaze Tech Concept - Sergio Scattone</h1>
      <div>
        <label htmlFor="teamDropdown">Select a Team:</label>
        <select id="teamDropdown" onChange={handleTeamChange} value={selectedTeam}>
          <option key={0} value="" disabled>Select a Team</option>
          {configs.teams.map(team => (
            <option key={team.id} value={team.id}>{team.id}</option>
          ))}
        </select>
      </div>
      <div style={columnStyle}>
        <div style={halfWidth}>
          <SoccerPlayersList teamKey={selectedTeam} />
        </div>
        <div style={halfWidth}>
          <SoccerMatchesList teamKey={selectedTeam} />
        </div>
      </div>
    </div>
  );
}

export default App;
