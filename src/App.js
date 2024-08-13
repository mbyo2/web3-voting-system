import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import ProposalList from './components/ProposalList';
import ProposalForm from './components/ProposalForm';
import VoterManagement from './components/VoterManagement';
import CandidateManagement from './components/CandidateManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add-proposal">Add Proposal</Link></li>
            <li><Link to="/manage-voters">Manage Voters</Link></li>
            <li><Link to="/manage-candidates">Manage Candidates</Link></li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={ProposalList} />
          <Route path="/add-proposal" component={ProposalForm} />
          <Route path="/manage-voters" component={VoterManagement} />
          <Route path="/manage-candidates" component={CandidateManagement} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;