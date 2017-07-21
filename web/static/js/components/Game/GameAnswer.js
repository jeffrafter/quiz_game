import React from 'react'

export default class GameAnswer extends React.Component {
  render() {
    return <p>The answer is: {this.props.question[1]}</p>
  }
}
