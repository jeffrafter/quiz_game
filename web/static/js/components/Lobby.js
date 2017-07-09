import React from 'react'
import { connect } from 'react-redux'
import { Socket } from 'phoenix';
import { Link } from 'react-router'

class Lobby extends React.Component {

  constructor(props) {
    super(props)
    this.joinGame = this.joinGame.bind(this)
  }

  joinGame() {
    const gameId = this.gameIdField.value
  }

  render() {
    return (
      <div className="center">
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">Join a game!</h2>
        </div>

        <Link className="btn" to="/game">Start a new game</Link>
        <br/>
        <input ref={(t) => {this.gameIdField = t}} type="text" placeholder="Enter game code" />
        <a className="btn" href="#" onClick={ this.joinGame }>Go!</a>

        <div className="meta">
          Player id: { this.props.playerId }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    playerId: state.game.playerId,
    socket: state.socket
  }
}

export default connect(mapStateToProps)(Lobby)
