import React, { useState, useEffect } from 'react';
import { voting_backend } from '../../../declarations/voting_backend';

function CandidateManagement() {
  const [candidates, setCandidates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  async function fetchCandidates() {
    const fetchedCandidates = await voting_backend.getCandidates();
    setCandidates(fetchedCandidates);
  }

  async function handleUpdateCandidate(id) {
    await voting_backend.updateCandidate(id, editName);
    setEditingId(null);
    setEditName('');
    fetchCandidates();
  }

  async function handleDeleteCandidate(id) {
    await voting_backend.deleteCandidate(id);
    fetchCandidates();
  }

  return (
    <div>
      <h2>Candidate Management</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            {editingId === candidate.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <button onClick={() => handleUpdateCandidate(candidate.id)}>Save</button>
              </>
            ) : (
              <>
                {candidate.name} - Votes: {candidate.votes}
                <button onClick={() => {
                  setEditingId(candidate.id);
                  setEditName(candidate.name);
                }}>Edit</button>
                <button onClick={() => handleDeleteCandidate(candidate.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CandidateManagement;