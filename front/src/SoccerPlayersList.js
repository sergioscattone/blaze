import React, { useState, useEffect } from 'react';
import axios from 'axios';
import configs from './configs';

const SoccerPlayersList = ({ teamKey }) => {
  const [message, setMessage] = useState('Please select a team to fetch the data');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!teamKey) return;
    const fetchPlayers = async (page) => {
      try {
        const endpointUrl = `${configs.apiUrl}teams/${teamKey}/players?page=${page}`;
        const response = await axios.get(endpointUrl);
        setPlayers(response.data);
        setLoading(false);
        setMessage();
      } catch (error) {
        console.error('Error fetching players:', error);
        setMessage(`There was an error fetching the data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchPlayers(currentPage);
  }, [currentPage, teamKey]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div>
      <h1>Soccer Players List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : 
      message ? (
        <p>{message}</p>
      ) : (
        <div>
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name} ({player.number}) - {player.type}: {player.age} year's old with ranking {player.ranking}
              </li>
            ))}
          </ul>
          <div>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous Page
            </button>
            <span> Page {currentPage} </span>
            <button onClick={handleNextPage}>Next Page</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoccerPlayersList;