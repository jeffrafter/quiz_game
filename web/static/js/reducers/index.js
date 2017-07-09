import { reducer } from 'redux'
import * as constants from '../constants/index'

export default (state = {}, action) => {
  console.log("Reducer for state, action", state, action)
  switch(action.type) {
    case constants.SET_PLAYER_ID:
      return Object.assign({}, state, { playerId: action.playerId })
    default:
      return state
  }
}
