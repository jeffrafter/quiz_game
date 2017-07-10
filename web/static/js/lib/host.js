import { Socket } from 'phoenix'

export default class Host {
  constructor(hostId) {
    this.hostId = hostId
    this.channel = null
    this.game = null
  }

  connect(callback) {
    if (this.channel) { return }

    let socket = new Socket("/socket", {params: {id: hostId}})
    socket.connect()

    let channel = socket.channel('host:' + hostId)

    // When you first join the channel, the game will be looked up
    // or created. If the connection to the host is severed the game will
    // continue to run and the host can reconnect.
    channel.join()
      .receive('ok', game => {
        console.log('ok', game)
        this.game = game
        callback(game)
      })
      .receive('error', reply => {
        error(`Sorry, you can't join because ${reply.reason}`)
      })

    this.channel = channel
  }

  start(callback) {
    this.channel.push("start", {})
      .receive('ok', callback)
      .receive('error', reply => { console.log(`Error ${reply.reason}`) })
  }
}
