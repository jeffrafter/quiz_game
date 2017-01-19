defmodule QuizGame.UserSocket do
  use Phoenix.Socket

  ## Channels
  channel "lobby", QuizGame.LobbyChannel
  channel "host:*", QuizGame.HostChannel
  channel "player:*", QuizGame.PlayerChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket

  # We expect the socket to connect with an id
  def connect(%{"id" => id}, socket) do
    {:ok, assign(socket, :id, id)}
  end

  # If you try to connect with empty params, it is an error
  def connect(_, _socket), do: :error

  # By specifying an id we can broadcast to this socket by id later
  def id(socket), do: "users_socket:#{socket.assigns.id}"
end
