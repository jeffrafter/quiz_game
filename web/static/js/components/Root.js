import React from 'react'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import store from '../store/index'

import * as actions from '../actions/index'


class Root extends React.Component {
  constructor(props) {
    super(props)
    this.props.setPlayerId(window.playerId)
  }

  render() {
    return (
      <div>
      {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    playerId: state.game.playerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPlayerId: (id) => { dispatch(actions.setPlayerId(id)) }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Root)
