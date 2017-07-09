import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './store';
import Root from './components/Root'
import Welcome from './components/Welcome'
import Lobby from './components/Lobby'
import Game from './components/Game'

const history = syncHistoryWithStore(browserHistory, store)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Root}>
            <IndexRoute component={Welcome}/>
            <Route path="lobby" component={Lobby}/>
            <Route path="game/:id" component={Game}/>
          </Route>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('container')
)
