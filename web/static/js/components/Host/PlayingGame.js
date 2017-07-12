import React from 'react';
import { connect } from 'react-redux'

class PlayingGame extends React.Component {
  componentDidMount() {
    this.props.host.channel.on('tick', game => {
      console.log(game)
    })
  }

  render() {
    return (
      <div className="center">
        <p>We playin!</p>
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

export default connect(mapStateToProps)(PlayingGame)
