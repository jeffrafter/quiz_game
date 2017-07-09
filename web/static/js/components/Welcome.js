import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../actions/index'

class Welcome extends React.Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">Welcome to<br/>Quiz Game!</h2>
        </div>

        <div className="center">
          <Link className="btn" to="/lobby">Join a game</Link>
        </div>

        <div className="meta">
          Player id: {this.props.playerId}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { playerId: state.game.playerId }
}

export default connect(mapStateToProps)(Welcome)
