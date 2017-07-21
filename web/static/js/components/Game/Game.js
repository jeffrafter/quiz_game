import React from 'react'
import { connect } from 'react-redux'
import { updateGame } from '../../actions'
import {
  GameWaiting,
  GameIntro,
  GameReady,
  GameQuestion,
  GameBuzz,
  GameVoting,
  GameScoring,
  GameAnswer,
  GameLeaders,
  GameWinners,
} from '../Game'

class Game extends React.Component {
  componentDidMount() {
    this.connectToGame()
    this.props.player.channel.on('game', game => {
      this.props.updateGame(game)
    })
    this.props.player.channel.on('tick', game => {
      this.props.updateGame(game)
    })
  }

  connectToGame() {
    const gameId = this.props.params.gameId
    this.props.player.connect(gameId, response => {
      if (response.error) {
        alert("this game probably doesn't exist");
      } else {
        this.props.updateGame(response.game)
      }
    })
  }

  render() {
    const game = this.props.game

    if (!game || game.state === "waiting") {
      return <GameWaiting />
    }

    if (game.state == "intro") {
      return <GameIntro />
    }

    if (game.state == "ready") {
      return <GameReady seconds={this.props.game.seconds} />
    }

    if (game.state == "question") {
      return <GameQuestion />
    }

    if (game.state == "buzz") {
      return <GameBuzz />
    }

    if (game.state == "voting") {
      return <GameVoting />
    }

    if (game.state == "scoring") {
      return <GameScoring />
    }

    if (game.state == "answer") {
      return <GameAnswer />
    }

    if (game.state == "leaders") {
      return <GameLeaders />
    }

    if (game.state == "winners") {
      return <GameWinners />
    }

    return null
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.game.player,
    game: state.game.game,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGame: (game) => { dispatch(updateGame(game)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game)
