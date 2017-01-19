defmodule QuizGame.HostChannel do
  use QuizGame.Web, :channel

  # When the host joins, check to see if the game is already
  # running. If it is, that is our game. If not, create a
  # new one. If the game is created, tell everyone in the lobby.
  def join("host:" <> id, _msg, socket) do
    pid =
      case QuizGame.Game.Supervisor.create_game(id) do
        {:ok, pid} -> pid
        {:error, {:already_started, pid}} -> pid
      end

    game_data = GenServer.call(pid, :get_data)

    status = game_data.state

    socket =
      socket
      |> assign(:game_id, id)
      |> assign(:status, status)

    send self(), {:after_join, status}

    {:ok, game_data, socket}
  end

  def handle_info({:after_join, _status}, socket) do
    QuizGame.LobbyChannel.broadcast_current_games

    {:noreply, socket}
  end
end
