import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/Home';
import Player from './components/player';
import Chat from './components/chat';
import Join from './components/join';

function App(props) {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" >
            <Home />
          </Route>
          <Route exact path="/join/:id" render={props => (
            <>
              <Player {...props} />
              <Chat {...props} />
            </>
          )} />
          <Route exact path='/join'>
            <Join />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
