import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Player } from '../../lib'
import { updateGame } from '../../actions'

class PlayerGame extends React.Component {
  componentDidMount() {
    this.props.player.channel.on('tick', game => {
      console.log('player received tick', game)
      this.props.updateGame(game)
    })

    this.props.player.channel.on('timer_ended', game => {
      console.log('player received timer_ended', game)
      this.props.updateGame(game)
    })
  }

  render() {

    const timerElem = this.props.game.state === "playing" ?
      (<p>Seconds left: {this.props.game.seconds}</p>) :
      (<p>Buzzzzzzzzzzzzzzzzz</p>);

    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">{timerElem}</h2>
        </div>

        <div className="meta">
          Player id: {this.props.player.playerId}<br/>
          Game id: {this.props.player.gameId}
        </div>
      </div>
    )
  }
}
let mapStateToProps = (state, props) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(PlayerGame)
