defmodule QuizGame.GameChannel do
  use QuizGame.Web, :channel

  def join("game:" <> id, _msg, socket) do
    _pid =
      case QuizGame.Game.Supervisor.create_game(id) do
        {:ok, pid} -> pid
        {:error, {:already_started, pid}} -> pid
      end

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

  def handle_info({:after_join, status}, socket) do
    QuizGame.LobbyChannel.broadcast_current_games

    {:noreply, socket}
  end
end
