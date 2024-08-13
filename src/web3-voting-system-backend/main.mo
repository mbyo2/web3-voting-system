import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor VotingSystem {
    private type Voter = {
        id: Principal;
        name: Text;
        hasVoted: Bool;
    };

    private type Candidate = {
        id: Nat;
        name: Text;
        votes: Nat;
    };

    private stable var nextCandidateId: Nat = 0;
    private var candidates = HashMap.HashMap<Nat, Candidate>(10, Nat.equal, Hash.hash);
    private var voters = HashMap.HashMap<Principal, Voter>(10, Principal.equal, Principal.hash);

    // Candidate Management
    public shared(msg) func addCandidate(name: Text) : async Nat {
        let id = nextCandidateId;
        nextCandidateId += 1;
        let newCandidate: Candidate = {
            id = id;
            name = name;
            votes = 0;
        };
        candidates.put(id, newCandidate);
        id
    };

    public query func getCandidates() : async [Candidate] {
        Iter.toArray(candidates.vals())
    };

    public shared(msg) func updateCandidate(id: Nat, name: Text) : async Bool {
        switch (candidates.get(id)) {
            case null { false };
            case (?candidate) {
                let updatedCandidate: Candidate = {
                    id = id;
                    name = name;
                    votes = candidate.votes;
                };
                candidates.put(id, updatedCandidate);
                true
            };
        }
    };

    public shared(msg) func deleteCandidate(id: Nat) : async Bool {
        switch (candidates.remove(id)) {
            case null { false };
            case (?_) { true };
        }
    };

    // Voter Management
    public shared(msg) func registerVoter(name: Text) : async Bool {
        switch (voters.get(msg.caller)) {
            case (?_) { false }; // Voter already registered
            case null {
                let newVoter: Voter = {
                    id = msg.caller;
                    name = name;
                    hasVoted = false;
                };
                voters.put(msg.caller, newVoter);
                true
            };
        }
    };

    public query func getVoters() : async [Voter] {
        Iter.toArray(voters.vals())
    };

    public shared(msg) func updateVoter(name: Text) : async Bool {
        switch (voters.get(msg.caller)) {
            case null { false };
            case (?voter) {
                let updatedVoter: Voter = {
                    id = msg.caller;
                    name = name;
                    hasVoted = voter.hasVoted;
                };
                voters.put(msg.caller, updatedVoter);
                true
            };
        }
    };

    // Voting
    public shared(msg) func vote(candidateId: Nat) : async Bool {
        switch (voters.get(msg.caller), candidates.get(candidateId)) {
            case (?voter, ?candidate) {
                if (voter.hasVoted) { return false; };
                let updatedVoter: Voter = {
                    id = voter.id;
                    name = voter.name;
                    hasVoted = true;
                };
                voters.put(msg.caller, updatedVoter);
                let updatedCandidate: Candidate = {
                    id = candidate.id;
                    name = candidate.name;
                    votes = candidate.votes + 1;
                };
                candidates.put(candidateId, updatedCandidate);
                true
            };
            case (_, _) { false };
        }
    };
}