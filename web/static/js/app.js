import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './store';
import { Host } from './components/Host'
import { Welcome } from './components/Welcome'
import { Game } from './components/Game'

const history = syncHistoryWithStore(browserHistory, store)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Welcome}/>
          <Route path="/host" component={Host}/>
          <Route path="/game/:gameId" component={Game} />
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('container')
)
