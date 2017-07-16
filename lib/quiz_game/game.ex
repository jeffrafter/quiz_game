defmodule QuizGame.Game do
  use GenServer

  # The basic state of the game:
  #
  # - waiting
  # - intro
  # - ready
  # - question
  # - buzz
  # - voting
  # - scoring
  # - answer
  # - leaders
  # - winner
  defstruct [
    id: nil,
    host: nil,
    players: [],
    winner: nil,
    questions: [],
    answers: [],
    state: nil,
    timer_seconds: nil, # used when a timer is counting down
    timer_state: nil # used as a completion state when the timer finishes
  ]

  # GenServer client

  def join(game_id, player_id) do
    GenServer.call(via_tuple(game_id), {:join, player_id})
  end

  def start(id) do
    GenServer.call(via_tuple(id), :start)
  end

  def get_data(game_id) do
    GenServer.call(via_tuple(game_id), :get_data)
  end

  # GenServer init

  def init(id) do
    game = %__MODULE__{
      id: id,
      host: nil,
      players: [],
      winner: nil,
      questions: QuizGame.Questions.questions,
      answers: [],
      state: :waiting,
      timer_seconds: nil,
      timer_state: nil
    }

    {:ok, game}
  end

  # GenServer server

  def start_link(id) do
    GenServer.start_link(__MODULE__, id, name: via_tuple(id))
  end

  # When a player attempts to join, first try to determine if they have already
  # joined the game. If so, return the game, otherwise add them and return the
  # game
  def handle_call({:join, player_id}, _from, game) do
    if Enum.find(game.players, fn(x) -> x[:id] == player_id end) do
      {:reply, {:ok, game}, game}
    else
      # Add the player to the game
      player = %{
        id: player_id,
        name: player_id,
        state: :waiting,
        score: 0
      }
      game = %{game | players: [player | game.players]}

      {:reply, {:ok, game}, game}
    end
  end

  # Get the game state (when connecting)
  def handle_call(:get_data, _from, game) do
    {:reply, game, game}
  end

  # Start the game (invoked by the host)
  def handle_call(:start, _from, game) do
    game = %{game | players: Enum.map(game.players, fn(x) -> %{x | score: 0} end)}
    game = start_timer(game, 8, :intro)
    broadcast(game, "game")

    {:reply, {:ok, game}, game}
  end

  # Timer

  def handle_info(:tick, %{timer_seconds: nil} = game), do: {:noreply, game}
  def handle_info(:tick, game) do
    seconds = game.timer_seconds - 1

    game = if seconds > 0 do
      %{game | timer_seconds: seconds}
    else
      %{game | state: game.timer_state, timer_seconds: nil, timer_state: nil}
    end

    if seconds > 0 do
      broadcast(game, "tick")
    else
      broadcast(game, "done")
    end

    if seconds > 0 do
      schedule_tick()
    end

    {:noreply, game}
  end

  defp schedule_tick() do
    Process.send_after(self(), :tick, 1000)
  end

  defp start_timer(game, seconds, state) do
    game = %{game | timer_seconds: seconds, timer_state: state}
    schedule_tick()
    game
  end

  # defp cancel_timer(game) do
  #   game = %{game | timer_seconds: nil, timer_state: nil}
  #   broadcast(game, "cancel")
  #   game
  # end

  defp via_tuple(id) do
    {:via, Registry, {:game_registry, id}}
  end

  defp broadcast(game, message) do
    QuizGame.Endpoint.broadcast("game:#{game.id}", message, game)
    QuizGame.Endpoint.broadcast("host:#{game.id}", message, game)
  end
end
