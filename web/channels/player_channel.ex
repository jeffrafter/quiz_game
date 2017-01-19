defmodule QuizGame.PlayerChannel do
  use QuizGame.Web, :channel

  # Join a game. But don't let the player join more
  # than one game at a time. Also, check if the player
  # has already joined the game. If so, reconnect them.
  def join("player:" <> id, _msg, socket) do
    case QuizGame.Game.join(id, id) do
      {:ok, status} ->
        socket =
          socket
          |> assign(:game_id, id)
          |> assign(:status, status)
        send self(), {:after_join, status}
        {:ok, %{state: status}, socket}
      {:error, reason} ->
        {:error, %{reason: reason}}
    end
  end

  def handle_info({:after_join, _status}, socket) do
    QuizGame.LobbyChannel.broadcast_current_games

    {:noreply, socket}
  end
end
