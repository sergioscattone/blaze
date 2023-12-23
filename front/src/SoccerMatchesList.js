import React, { useState, useEffect } from 'react';
import axios from 'axios';
import configs from './configs';

const SoccerMatchesList = ({ teamKey }) => {
  const [message, setMessage] = useState('Please select a team to fetch the data');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!teamKey) return;
    const fetchMatches = async (page) => {
      try {
        const endpointUrl = `${configs.apiUrl}teams/${teamKey}/matches?page=${page}`;
        const response = await axios.get(endpointUrl);
        setMatches(response.data);
        setLoading(false);
        setMessage();
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMessage(`There was an error fetching the data: ${error.message}`);
        setLoading(false);
      }
    };

    fetchMatches(currentPage);
  }, [currentPage, teamKey]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div>
      <h1>Soccer Matches List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : 
      message ? (
        <p>{message}</p>
      ) : (
        <div>
          <ul>
            {matches.map((match) => (
              <li key={match.id}>
                {match.date} - {match.league}: {match.home_score}-{match.away_score}
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

export default SoccerMatchesList;