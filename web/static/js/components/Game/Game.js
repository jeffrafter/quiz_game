import React from 'react'
import { connect } from 'react-redux'
import { updateGame } from '../../actions'
import { BeatLoader } from 'halogen'
import { GamePlaying } from '../Game'

class Game extends React.Component {
  componentDidMount() {
    this.connectToGame()
    this.props.player.channel.on('game', game => {
      this.props.updateGame(game)
    })
  }

  connectToGame() {
    const gameId = this.props.params.gameId
    this.props.player.connect(gameId, response => {
      if (response.error) {
        // console.log(response.error);
        alert("this game probably doesn't exist");
      } else {
        this.props.updateGame(response.game)
      }
    })
  }

  render() {
    const game = this.props.game

    if (!game || game.state == "waiting") {
      return <BeatLoader />
    }
    return <GamePlaying />
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

export default connect(mapStateToProps, mapDispatchToProps)(Game)
