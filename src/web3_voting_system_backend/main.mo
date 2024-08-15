// src/web3_voting_system_backend/main.mo

import Array "mo:base/Array";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor VotingSystem {
    // Types
    type Voter = {
        id: Principal;
        name: Text;
        hasVoted: Bool;
    };

    type Candidate = {
        id: Nat;
        name: Text;
        position: Text;
        voteCount: Nat;
    };

    type Election = {
        id: Nat;
        name: Text;
        startTime: Time.Time;
        endTime: Time.Time;
        positions: [Text];
        candidates: [Candidate];
    };

    // State
    private stable var nextElectionId: Nat = 0;
    private stable var nextCandidateId: Nat = 0;
    private var elections = HashMap.HashMap<Nat, Election>(0, Nat.equal, Hash.hash);
    private var voters = HashMap.HashMap<Principal, Voter>(0, Principal.equal, Principal.hash);

    // Helper functions
    private func isElectionActive(election: Election) : Bool {
        let currentTime = Time.now();
        return currentTime >= election.startTime and currentTime <= election.endTime;
    };

    // Public functions
    public shared(msg) func createElection(name: Text, startTime: Time.Time, endTime: Time.Time, positions: [Text]) : async Nat {
        let electionId = nextElectionId;
        nextElectionId += 1;

        let newElection: Election = {
            id = electionId;
            name = name;
            startTime = startTime;
            endTime = endTime;
            positions = positions;
            candidates = [];
        };

        elections.put(electionId, newElection);
        electionId
    };

    public shared(msg) func addCandidate(electionId: Nat, name: Text, position: Text) : async Bool {
        switch (elections.get(electionId)) {
            case null { false };
            case (?election) {
                let candidateId = nextCandidateId;
                nextCandidateId += 1;

                let newCandidate: Candidate = {
                    id = candidateId;
                    name = name;
                    position = position;
                    voteCount = 0;
                };

                let updatedCandidates = Array.append(election.candidates, [newCandidate]);
                let updatedElection = {
                    id = election.id;
                    name = election.name;
                    startTime = election.startTime;
                    endTime = election.endTime;
                    positions = election.positions;
                    candidates = updatedCandidates;
                };

                elections.put(electionId, updatedElection);
                true
            };
        }
    };

    public shared(msg) func registerVoter(name: Text) : async Bool {
        let voterId = msg.caller;
        
        switch (voters.get(voterId)) {
            case null {
                let newVoter: Voter = {
                    id = voterId;
                    name = name;
                    hasVoted = false;
                };
                voters.put(voterId, newVoter);
                true
            };
            case (?_) { false };
        }
    };

    public shared(msg) func vote(electionId: Nat, candidateId: Nat) : async Bool {
        let voterId = msg.caller;
        
        switch (voters.get(voterId), elections.get(electionId)) {
            case (?voter, ?election) {
                if (voter.hasVoted or not isElectionActive(election)) {
                    return false;
                };

                let updatedCandidates = Array.map<Candidate, Candidate>(
                    election.candidates,
                    func (candidate: Candidate) : Candidate {
                        if (candidate.id == candidateId) {
                            return {
                                id = candidate.id;
                                name = candidate.name;
                                position = candidate.position;
                                voteCount = candidate.voteCount + 1;
                            };
                        };
                        candidate
                    }
                );

                let updatedElection = {
                    id = election.id;
                    name = election.name;
                    startTime = election.startTime;
                    endTime = election.endTime;
                    positions = election.positions;
                    candidates = updatedCandidates;
                };

                elections.put(electionId, updatedElection);

                let updatedVoter = {
                    id = voter.id;
                    name = voter.name;
                    hasVoted = true;
                };

                voters.put(voterId, updatedVoter);
                true
            };
            case _ { false };
        }
    };

    public query func getElection(electionId: Nat) : async ?Election {
        elections.get(electionId)
    };

    public query func getVoter(voterId: Principal) : async ?Voter {
        voters.get(voterId)
    };

    public query func getElectionResults(electionId: Nat) : async ?[Candidate] {
        switch (elections.get(electionId)) {
            case null { null };
            case (?election) {
                if (Time.now() <= election.endTime) {
                    null
                } else {
                    ?election.candidates
                };
            };
        }
    };
}