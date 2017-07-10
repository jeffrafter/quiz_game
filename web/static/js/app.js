import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './store';
import PlayerWelcome from './components/Player/PlayerWelcome'
import Host from './components/Host/Host'
import Player from './components/Player/Player'

const history = syncHistoryWithStore(browserHistory, store)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Player}/>
          <Route path="/host" component={Host}/>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App/>,
  document.getElementById('container')
)
