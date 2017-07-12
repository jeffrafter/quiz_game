defmodule QuizGame.Game do
  use GenServer

  # possible states
  #   waiting
  #   playing
  #   asking
  #   voting
  #   scoring
  #   ending

  @typedef """
  The basic state of the game
  """
  defstruct [
    id: nil,
    questions: [],
    host: nil,
    players: [],
    seconds: 0,
    turns: [],
    winner: nil,
    state: nil,
    round: nil
  ]

  def join(game_id, player_id) do
    GenServer.call(via_tuple(game_id), {:join, player_id})
  end

  def start(id) do
    GenServer.call(via_tuple(id), :start)
  end

  def get_data(game_id) do
    GenServer.call(via_tuple(game_id), :get_data)
  end

  def init(id) do
    game = %__MODULE__{
      id: id,
      questions: QuizGame.Questions.questions,
      host: nil,
      players: [],
      seconds: 0,
      turns: [], winner: nil, state: :waiting, round: nil
    }

    {:ok, game}
  end

  def next(game) do
    case game.state do
      :waiting -> :playing
      :playing -> :asking
      :asking -> :voting
      :voting -> :scoring
      :scoring ->
        if (game.round == 4) do
          :ending
        else
          :asking
        end
    end
  end

  def start_link(id) do
    GenServer.start_link(__MODULE__, id, name: via_tuple(id))
  end

  def handle_call({:join, player_id}, _from, game) do
    if Enum.find(game.players, fn(x) -> x[:id] == player_id end) do
      {:reply, {:ok, game.state}, game}
    else
      player = %{
        id: player_id,
        name: player_id,
        state: :waiting,
        score: 0
      }
      {:reply, {:ok, game.state}, %{game | players: [player | game.players]}}
    end
  end

  def handle_call(:get_data, _from, game) do
    {:reply, game, game}
  end

  def handle_call(:start, _from, game) do
    game = handle_start(game)

    QuizGame.Endpoint.broadcast("game:#{game.id}", "game", game)

    {:reply, {:ok, :playing}, game}
  end

  def handle_info(:tick, game) do
    new_seconds = game.seconds - 1
    next = if (new_seconds > 0), do: %{game | seconds: new_seconds}, else: %{game | state: next(game)}
    if new_seconds > 0 do
      QuizGame.Endpoint.broadcast("game:#{next.id}", "tick", next)
      schedule_tick()
    else
      QuizGame.Endpoint.broadcast("game:#{next.id}", "timer_ended", next)
    end

    {:noreply, next}
  end

  defp schedule_tick() do
    Process.send_after(self(), :tick, 1000)
  end

  defp via_tuple(id) do
    {:via, Registry, {:game_registry, id}}
  end

  defp handle_start(game) do
    game = %{game | players: Enum.map(game.players, fn(x) -> %{x | score: 0} end)}
    game = %{game | seconds: 20, state: :playing}
    schedule_tick()
    game
  end
end
