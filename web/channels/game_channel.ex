defmodule QuizGame.GameChannel do
  use QuizGame.Web, :channel

  # Join a game. But don't let the player join more
  # than one game at a time. Also, check if the player
  # has already joined the game. If so, reconnect them.
  def join("game:" <> game_id, _msg, socket) do
    id = socket.assigns.id

    case QuizGame.Game.join(game_id, id) do
      {:ok, game} ->
        socket =
          socket
          |> assign(:game_id, game_id)
          |> assign(:status, game.state)

        send self(), {:after_join, game.state}
        {:ok, game, socket}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_info({:after_join, _status}, socket) do
    game_id = socket.assigns.game_id

    game = QuizGame.Game.get_data(game_id)

    QuizGame.Endpoint.broadcast("host:#{game_id}", "game", game)

    {:noreply, socket}
  end
end
