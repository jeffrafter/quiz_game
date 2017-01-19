// We'll need a socket, luckily Phoenix provides a lot of the plumbing for us
import {Socket} from 'phoenix'

let Lobby = {
  channel: null,

  init() {
    Lobby.connect()
    Lobby.attachEvents()
  },

  connect() {
    // To connect we need to create a new socket and pass our unique id
    // By default, Phoenix has setup a /socket route for us
    let socket = new Socket("/socket", {params: {id: window.playerId}})
    socket.connect()

    // Connect to our lobby channel and call the join method
    let channel = socket.channel('lobby')

    // Join fulfills promises on completion
    channel.join()
      .receive('ok', reply => {
        // If we successfully joined, we should have received a current
        // list of games to display
        Lobby.renderGames(reply.games)
      })
      .receive('error', reply => {
        // It is not the best user experience to just log errors...
        console.log(`Sorry, you can't join because ${reply.reason}`)
      })

    // If we receive a push message with the key "games" we are getting
    // an update from the server about a change in the list of available
    // games and need to update the display
    channel.on('games', message => {
      Lobby.renderGames(message.games)
    })

    // We'll want to save this for later
    Lobby.channel = channel
  },

  renderGames(games) {
    // Pretty basic render function, maps each game object in the games message
    let ul = document.getElementById('games')
    ul.innerHTML = `
      <ul>
        ${games.map(game => `<li><a href="/play?id=${game.id}" class="btn orange">Join ${game.id}</a></li>`)}
      </ul>
    `
  },

  attachEvents() {
    let button = document.getElementById("update")
    button.onclick = Lobby.fetchGames
  },

  fetchGames(e) {
    e.preventDefault()
    e.stopPropagation()

    // When the user clicks update we'll send a "games" message to the
    // server indicating that we want to receive an updated list of games
    // The name of this message is coincidentally the same as our earlier
    // listener, the two are completely separate. We've named them the same
    // because they accomplish the same goal
    Lobby.channel.push('games', {})
      .receive('ok', reply => {
        Lobby.renderGames(reply.games)
      })
      .receive('error', reply => {
        console.log(`Sorry, you can't fetch games because ${reply.reason}`)
      })
  },

}
export default Lobby
