import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateGame } from '../../actions'

class PlayerWelcome extends React.Component {
  constructor(props) {
    super(props)
    this.joinGame = this.joinGame.bind(this)
  }

  joinGame() {
    const gameId = this.gameIdField.value

    this.props.player.connect(gameId, (game) => {
      window.localStorage.setItem("gameId", gameId);
      console.log("connected", game);
      this.props.updateGame(game);
    })
    this.props.player.channel.on('game', game => {
      console.log('10 players a playin', game)
      this.props.updateGame(game)
    })
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">Welcome to<br/>Quiz Game!</h2>
        </div>

        <div className="center">
          <input ref={(t) => {this.gameIdField = t}} type="text" placeholder="Enter game code" />
          <a className="btn" href="#" onClick={ this.joinGame }>Go!</a>
        </div>

        <div className="meta">
          Player id: {this.props.player.playerId}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerWelcome)
