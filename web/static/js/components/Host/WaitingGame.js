import React from 'react';

export default class WaitingGame extends React.Component {
  render() {
    let players = null
    if (this.props.game) {
      players = this.props.game.players.map((player) => {
        return <p key={player.id}>{player.id}</p>
      })
    }

    let button = null
    if (players && players.length) {
      button = <button className="btn orange" onClick={this.props.startGame}>Start game</button>
    }

    return (
      <div className="center">
        {players}
        {button}
      </div>
    )
  }
}
