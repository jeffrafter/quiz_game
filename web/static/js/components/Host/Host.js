import React from 'react'
import { connect } from 'react-redux'
import { updateGame } from '../../actions'

import WaitingGame from './WaitingGame'
import PlayingGame from './PlayingGame'

class Host extends React.Component {
  constructor(props) {
    super(props)
    this.startGame = this.startGame.bind(this)
  }

  componentDidMount() {
    this.props.host.connect(game => {
      console.log('host connected to game', game)
      this.props.updateGame(game)
    })
    this.props.host.channel.on('game', game => {
      console.log('host received the game', game)
      this.props.updateGame(game)
    })
  }

  startGame() {
    this.props.host.start(this.props.updateGame)
  }

  render() {
    let gameComponent = null;
    if (this.props.game && this.props.game.state === "waiting") {
      gameComponent = <WaitingGame
        game={this.props.game}
        startGame={this.startGame}
      />
    } else if (this.props.game) {
      gameComponent = <PlayingGame />
    }

    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">Welcome to<br/>Quiz Game!</h2>
        </div>
        {gameComponent}
        <div className="meta">
          Host id: {this.props.host.hostId}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    host: state.game.host,
    game: state.game.game
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateGame: (game) => { dispatch(updateGame(game)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Host)
