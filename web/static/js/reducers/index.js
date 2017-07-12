import { reducer } from 'redux'
import * as constants from '../constants/index'
import { Host, Player } from '../lib'

const initialState = {
  host: new Host(window.hostId),
  player: new Player(window.playerId),
  game: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_GAME":
      return Object.assign({}, state, {game: action.game})
    default:
      return state
  }
}
