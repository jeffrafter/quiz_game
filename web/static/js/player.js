import {Socket} from 'phoenix'

let Player = {
  channel: null,

  init() {
    Player.attachEvents()
    Player.connect()
  },

  attachEvents() {
    let button = document.getElementById("buzz")
    if (button) button.onclick = Player.buzz
  },

  buzz(e) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    console.log("Buzz!")
  },

  connect() {
    let socket = new Socket("/socket", {params: {id: window.playerId}})
    socket.connect()

    let channel = socket.channel('player:'+window.gameId)

    // When you first join the channel, the game will be looked up
    // or created. If the connection to the host is severed the game will
    // continue to run and the host can reconnect.
    channel.join()
      .receive('ok', reply => {
        console.log('ok', reply)
      })
      .receive('error', reply => {
        error(`Sorry, you can't join because ${reply.reason}`)
      })

    Player.channel = channel
  },

  error(message) {
    console.log(message)
  },
}
export default Player
