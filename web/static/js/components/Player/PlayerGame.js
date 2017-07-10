import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Player } from '../../lib'

class PlayerGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = { player: new Player() }
  }

  render() {
    console.log('rendering <PlayerGame />', this.props.game);
    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">You in that game!</h2>
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

export default connect(mapStateToProps)(PlayerGame)
