import { createStore, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import reducer from '../reducers/index'

// Add the reducer to your store on the `routing` key
const rootReducer = combineReducers({
  game: reducer,
  routing: routerReducer
})

export default createStore(rootReducer)
