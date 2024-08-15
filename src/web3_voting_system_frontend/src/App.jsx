import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ElectionPage from './pages/ElectionPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/election/:id" component={ElectionPage} />
              <Route path="/vote/:id" component={VotingPage} />
              <Route path="/results/:id" component={ResultsPage} />
            </Switch>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;