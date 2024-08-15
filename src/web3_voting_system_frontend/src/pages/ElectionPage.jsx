import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getActor } from '../utils/actor';

const ElectionPage = () => {
  const { id } = useParams();
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [election, setElection] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchElection();
    }
  }, [isAuthenticated, id]);

  const fetchElection = async () => {
    try {
      const actor = await getActor(identity);
      const electionData = await actor.getElection(Number(id));
      setElection(electionData);
    } catch (error) {
      console.error('Error fetching election:', error);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-xl">Please login to view election details.</p>;
  }

  if (!election) {
    return <p className="text-xl">Loading election details...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{election.name}</h1>
      <div className="mb-4">
        <p className="text-gray-600">Start: {new Date(Number(election.startTime) / 1000000).toLocaleString()}</p>
        <p className="text-gray-600">End: {new Date(Number(election.endTime) / 1000000).toLocaleString()}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Positions and Candidates</h2>
      {election.positions.map((position) => (
        <div key={position} className="mb-6">
          <h3 className="text-xl font-medium mb-2">{position}</h3>
          <ul className="space-y-2">
            {election.candidates
              .filter((candidate) => candidate.position === position)
              .map((candidate) => (
                <li key={candidate.id} className="bg-white shadow rounded-lg p-4">
                  {candidate.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <Link
        to={`/vote/${id}`}
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded inline-block mt-4"
      >
        Vote in this Election
      </Link>
    </div>
  );
};

export default ElectionPage;