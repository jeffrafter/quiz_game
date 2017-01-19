import {Socket} from 'phoenix'

let Host = {
  game: null,

  channel: null,

  init() {
    Host.attachEvents()
    Host.state('start')
  },

  attachEvents() {
    let button = document.getElementById("start")
    button.onclick = Host.start
  },

  // Handle state transitions and update the interface
  state(status) {
    document.querySelectorAll('.state').forEach(el => {
      if (el.getAttribute('data-state') === status) {
        el.className = 'state active'
      } else {
        el.className = 'state'
      }
    })
    Host.renderPlayers()
  },

  // When the user clicks the Start Game button
  start(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    Host.connect()
  },

  connect() {
    let socket = new Socket("/socket", {params: {id: window.hostId}})
    socket.connect()

    let channel = socket.channel('host:'+window.hostId)

    // When you first join the channel, the game will be looked up
    // or created. If the connection to the host is severed the game will
    // continue to run and the host can reconnect.
    channel.join()
      .receive('ok', game => {
        console.log('ok', game)
        Host.game = game
        Host.state(game.state)
      })
      .receive('error', reply => {
        error(`Sorry, you can't join because ${reply.reason}`)
      })

    Host.channel = channel
  },

  renderPlayers() {
    if (!Host.game) return

    let ul = document.getElementById('players')
    ul.innerHTML = `
      <ul>
        ${Host.game.players.map(player => `<li>${player}</li>`).join('')}
      </ul>
    `
  },

  error(message) {
    console.log(message)
  },
}
export default Host
