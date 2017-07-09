import { Socket } from 'phoenix'

export default class Player {
  constructor() {
    this.channel = null;
  }

  connect(gameId) {
    let socket = new Socket("/socket", {params: {id: window.playerId}})
    socket.connect()

    let channel = socket.channel(`player:${gameId}`)

    // When you first join the channel, the game will be looked up
    // or created. If the connection to the host is severed the game will
    // continue to run and the host can reconnect.
    channel.join()
      .receive('ok', reply => {
        console.log('ok', reply)
      })
      .receive('error', reply => {
        this.error(`Sorry, you can't join because ${reply.reason}`)
      })

    this.channel = channel
  }

  error(message) {
    console.log(message)
  }
}
