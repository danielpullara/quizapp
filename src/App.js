import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from '../src/components/Home';
import QuizInstructions from './components/quiz/QuizInstructions'
import Play from './components/quiz/Play'
import QuizSummary from './components/quiz/QuizSummary'

function App() {
  return (
    <Router>
      <Route path="/play/QuizSummary" exact component={QuizSummary}/>
      <Route path="/play/Quiz" exact component={Play}/>
      <Route path="/play/instructions" exact component={QuizInstructions}/>
      <Route path="/" exact  component={Home}/>
    </Router>
  );
}

export default App;