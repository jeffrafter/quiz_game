import React from 'react'

export default class GameQuestion extends React.Component {
  render() {
    return <h1>{this.props.question[0]}</h1>
  }
}
