import React from 'react'

export default class GameReady extends React.Component {
  render() {
    return <p>Get ready...... {this.props.seconds}</p>
  }
}
