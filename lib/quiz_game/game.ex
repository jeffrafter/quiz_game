defmodule QuizGame.Game do
  use GenServer

  @typedef """
  The basic state of the game
  """
  defstruct [
    id: nil,
    host: nil,
    questions: [],
    players: [],
    turns: [],
    winner: nil,
    state: nil,
  ]

  def join(id, player) do
    GenServer.call(via_tuple(id), {:join, player})
  end

  def init(id) do
    state = %__MODULE__{
      id: id,
      host: nil,
      questions: QuizGame.Questions.questions,
      players: [],
      turns: [],
      winner: nil,
      state: :waiting
    }

    {:ok, state}
  end

  def start_link(id) do
    GenServer.start_link(__MODULE__, id, name: via_tuple(id))
  end

  def handle_call({:join, player}, _from, game) do
    {:reply, {:ok, game.state}, %{game | players: [player | game.players]}}
  end

  def handle_call(:get_data, _from, game) do
    {:reply, game, game}
  end

  defp via_tuple(id) do
    {:via, Registry, {:game_registry, id}}
  end
end
