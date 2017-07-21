defmodule QuizGame.Game do
  use GenServer

  # import Logger

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
  # - winners
  defstruct [
    id: nil,
    host: nil,
    players: [],
    winner: nil,
    questions: [],
    answers: [],
    state: nil,
    seconds: nil # used when a timer is counting down
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
      seconds: nil
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
    game = %{game | players: Enum.map(game.players, fn(x) -> %{x | score: 0} end), state: :intro}
    game = start_timer(game, 8)
    broadcast(game, "game")

    {:reply, {:ok, game}, game}
  end

  # Timer
  defp start_timer(game, seconds) do
    game = %{game | seconds: seconds}
    schedule_tick()
    game
  end

  # When the timer finishes, we transition to the next state then
  # immediately start a new timer
  defp finish_timer(game) do
    game = next_state(game)

    case game.state do
      :ready -> start_timer(game, 3)
      :question -> next_question(game)
      :buzz -> start_timer(game, 3)
      :voting -> start_timer(game, 10)
      :scoring -> start_timer(game, 5)
      :answer -> start_timer(game, 3)
      :leaders -> start_timer(game, 3)
      _ -> game
    end
  end

  def next_state(game) do
    state = case game.state do
      :intro -> :ready
      :ready -> :question
      :question -> :buzz
      :buzz -> :voting
      :voting -> :scoring
      :scoring -> :answer
      :answer -> :leaders
      :leaders -> next_question_or_winners(game)
      _ -> game.state
    end

    %{game | state: state}
  end

  def next_question(game) do
    answer = %{}
    game = %{game | answers: [answer | game.answers]}
    start_timer(game, 10)
  end

  def next_question_or_winners(game) do
    question_count = Enum.count(game.questions)
    answer_count = Enum.count(game.answers)

    if answer_count < question_count do
      :ready
    else
      :winners
    end
  end

  # defp cancel_timer(game) do
  #   game = %{game | seconds: nil}
  #   broadcast(game, "cancel")
  #   game
  # end

  defp schedule_tick() do
    Process.send_after(self(), :tick, 1000)
  end

  def handle_info(:tick, %{seconds: nil} = game), do: {:noreply, game}
  def handle_info(:tick, game) do
    seconds = game.seconds - 1

    game = if seconds >= 0 do
      %{game | seconds: seconds}
    else
      finish_timer(game)
    end

    broadcast(game, "tick")

    if seconds >= 0 do
      schedule_tick()
    end

    {:noreply, game}
  end

  # Management

  defp via_tuple(id) do
    {:via, Registry, {:game_registry, id}}
  end

  defp broadcast(game, message) do
    QuizGame.Endpoint.broadcast("game:#{game.id}", message, game)
    QuizGame.Endpoint.broadcast("host:#{game.id}", message, game)
  end
end
