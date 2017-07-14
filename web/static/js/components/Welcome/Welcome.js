import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateGame } from '../../actions'
import { browserHistory } from 'react-router'

class Welcome extends React.Component {
  constructor(props) {
    super(props)
    this.joinGame = this.joinGame.bind(this)
  }

  joinGame() {
    const gameId = this.gameIdField.value
    browserHistory.push(`/game/${gameId}`);
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">Welcome to<br/>Quiz Game!</h2>
        </div>

        <div className="center">
          <input ref={(t) => {this.gameIdField = t}} type="text" placeholder="Enter game code" />
          <button className="btn" onClick={ this.joinGame }>Go!</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.game.player,
    game: state.game.game
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGame: (game) => { dispatch(updateGame(game)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
