import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getActor } from '../utils/actor';

const HomePage = () => {
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [elections, setElections] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchElections();
    }
  }, [isAuthenticated]);

  const fetchElections = async () => {
    try {
      const actor = await getActor(identity);
      // Assuming there's a method to get all elections, which we'll need to add to the backend
      const allElections = await actor.getAllElections();
      setElections(allElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Web3 Voting System</h1>
      {isAuthenticated ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Elections</h2>
          {elections.length > 0 ? (
            <ul className="space-y-4">
              {elections.map((election) => (
                <li key={election.id} className="bg-white shadow rounded-lg p-4">
                  <Link to={`/election/${election.id}`} className="text-lg font-medium text-indigo-600 hover:text-indigo-800">
                    {election.name}
                  </Link>
                  <p className="text-gray-600">Start: {new Date(Number(election.startTime) / 1000000).toLocaleString()}</p>
                  <p className="text-gray-600">End: {new Date(Number(election.endTime) / 1000000).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No active elections at the moment.</p>
          )}
        </div>
      ) : (
        <p className="text-xl">Please login to view and participate in elections.</p>
      )}
    </div>
  );
};

export default HomePage;
