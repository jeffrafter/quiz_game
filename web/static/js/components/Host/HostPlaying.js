import React from 'react';
import { connect } from 'react-redux'
import { updateGame } from '../../actions'

class HostPlaying extends React.Component {
  componentDidMount() {
    this.props.host.channel.on('tick', game => {
      console.log(game)
      this.props.updateGame(game)
    })
    this.props.host.channel.on('done', game => {
      console.log('player received done', game)
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
    updateGame: (game) => dispatch(updateGame(game))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HostPlaying)
