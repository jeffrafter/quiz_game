import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Player } from '../../lib'

class PlayerGame extends React.Component {
  constructor(props) {
    super(props)
    this.state = { player: new Player() }
  }

  componentDidMount() {
    this.state.player.connect(this.props.gameId)
  }

  render() {
    return (
      <div>
        <div className="jumbotron">
          <h2 id="welcome" className="animated pulse">You in that game!</h2>
        </div>

        <div className="meta">
        Player id: {this.props.playerId}<br/>
        Game id: {this.props.gameId}
        </div>
      </div>
    )
  }
}
let mapStateToProps = (state, props) => {
  return {
    playerId: state.game.playerId,
    gameId: props.params.id
  }
}

export default connect(mapStateToProps)(PlayerGame)
