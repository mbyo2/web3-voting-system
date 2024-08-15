import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getActor } from '../utils/actor';

const VotingPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [isVoting, setIsVoting] = useState(false);

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

  const handleVoteChange = (position, candidateId) => {
    setVotes({ ...votes, [position]: candidateId });
  };

  const handleSubmitVote = async () => {
    setIsVoting(true);
    try {
      const actor = await getActor(identity);
      for (const [position, candidateId] of Object.entries(votes)) {
        await actor.vote(Number(id), Number(candidateId));
      }
      alert('Your vote has been submitted successfully!');
      history.push(`/results/${id}`);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('There was an error submitting your vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  if (!isAuthenticated) {
    return <p className="text-xl">Please login to vote.</p>;
  }

  if (!election) {
    return <p className="text-xl">Loading election details...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vote in {election.name}</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        {election.positions.map((position) => (
          <div key={position} className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">{position}</h2>
            {election.candidates
              .filter((candidate) => candidate.position === position)
              .map((candidate) => (
                <div key={candidate.id} className="mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      name={position}
                      value={candidate.id}
                      onChange={() => handleVoteChange(position, candidate.id)}
                      checked={votes[position] === candidate.id}
                    />
                    <span className="ml-2">{candidate.name}</span>
                  </label>
                </div>
              ))}
          </div>
        ))}
        <button
          onClick={handleSubmitVote}
          disabled={isVoting || Object.keys(votes).length !== election.positions.length}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
        </button>
      </form>
    </div>
  );
};

export default VotingPage;