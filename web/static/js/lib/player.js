import { Socket } from 'phoenix'

export default class Player {
  constructor(playerId) {
    this.playerId = playerId
    this.gameId = null
    this.channel = null
  }

  connect(gameId, callback) {
    if (this.channel) { return }

    let socket = new Socket("/socket", {params: {id: this.playerId}})
    socket.connect()

    let channel = socket.channel(`game:${gameId}`)

    // When you first join the channel, the game will be looked up
    // or created. If the connection to the host is severed the game will
    // continue to run and the host can reconnect.
    channel.join()
      .receive('ok', game => {
        callback(game)
      })
      .receive('error', reply => {
        this.error(`Sorry, you can't join because ${reply.reason}`)
      })

    this.channel = channel
    this.gameId = gameId
  }

  error(message) {
    console.log(message)
  }
}
