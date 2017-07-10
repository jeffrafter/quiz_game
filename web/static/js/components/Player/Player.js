import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { updateGame } from '../../actions'
import { PlayerWelcome, PlayerGame } from '../Player'

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.joinGame = this.joinGame.bind(this)
    this.connectToGame = this.connectToGame.bind(this)
  }

  componentDidMount() {
    this.checkForExistingGame()
  }

  checkForExistingGame() {
    const gameId = window.localStorage.getItem('gameId');
    if (gameId) {
      this.connectToGame(gameId)
    }
  }

  joinGame() {
    const gameId = this.gameIdField.value
    this.connectToGame(gameId)
  }

  connectToGame(gameId) {
    console.log('player', this.props.player)
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
    console.log('rendering <Player />...', this.props.game)
    var game = this.props.game
    if (!game || (game && game.state == "waiting")) {
      return <PlayerWelcome />
    } else if (game) {
      return <PlayerGame game={game} />
    }
    return null;
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

export default connect(mapStateToProps, mapDispatchToProps)(Player)
