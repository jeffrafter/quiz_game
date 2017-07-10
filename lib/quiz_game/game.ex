defmodule QuizGame.Game do
  use GenServer

  @typedef """
  The basic state of the game
  """
  defstruct [
    id: nil,
    questions: [],
    host: nil,
    players: [],
    turns: [],
    winner: nil,
    state: nil,
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
      turns: [],
      winner: nil,
      state: :waiting
    }

    {:ok, game}
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

  defp via_tuple(id) do
    {:via, Registry, {:game_registry, id}}
  end

  defp handle_start(game) do
    game = %{game | state: :playing, winner: nil}
    game = %{game | players: Enum.map(game.players, fn(x) -> %{x | score: 0} end)}
    game
  end
end
