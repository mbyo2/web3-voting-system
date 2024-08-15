import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getActor } from '../utils/actor';
import { formatDate } from '../utils/dateUtils';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ResultsPage = () => {
  const { id } = useParams();
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [election, setElection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchElectionAndResults();
    }
  }, [isAuthenticated, id]);

  const fetchElectionAndResults = async () => {
    try {
      setLoading(true);
      const actor = await getActor(identity);
      const electionData = await actor.getElection(Number(id));
      setElection(electionData);

      const resultsData = await actor.getElectionResults(Number(id));
      setResults(resultsData);
    } catch (error) {
      console.error('Error fetching election results:', error);
      setError('Failed to fetch election results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-xl">Please login to view election results.</p>;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!election || !results) {
    return <p className="text-xl">No results available for this election.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{election.name} Results</h1>
      <div className="mb-4">
        <p className="text-gray-600">Start: {formatDate(election.startTime)}</p>
        <p className="text-gray-600">End: {formatDate(election.endTime)}</p>
      </div>
      {election.positions.map((position) => (
        <div key={position} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{position}</h2>
          <ul className="space-y-4">
            {results
              .filter((candidate) => candidate.position === position)
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((candidate) => (
                <li key={candidate.id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{candidate.name}</span>
                    <span className="text-indigo-600 font-bold">{candidate.voteCount} votes</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full">
                    <div
                      className="bg-indigo-600 text-xs font-medium text-indigo-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${(candidate.voteCount / results.reduce((sum, c) => sum + c.voteCount, 0)) * 100}%` }}
                    >
                      {((candidate.voteCount / results.reduce((sum, c) => sum + c.voteCount, 0)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;