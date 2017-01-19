defmodule QuizGame.Game.Supervisor do
  use Supervisor

  @doc """
  We define how new processes are started and name them based on the
  module (QuizGame.Game.Supervisor) name so that they can be accessed
  without using pids later. We'll be using a simple_one_for_one
  supervision strategy so we'll only ever have one name and one kind
  of child that is supervised.
  """
  def init(_) do
    children = [
      worker(QuizGame.Game, [], restart: :temporary)
    ]

    supervise(children, strategy: :simple_one_for_one, name: __MODULE__)
  end

  def start_link, do: Supervisor.start_link(__MODULE__, [], name: __MODULE__)

  def create_game(id) do
    Supervisor.start_child(__MODULE__, [id])
  end

  @doc """
  Leverage the supervisor to inspect all child processes and fetch data
  from them.
  """
  def games do
    __MODULE__
    |> Supervisor.which_children
    |> Enum.map(&data/1)
  end

  defp data({_id, pid, _type, _modules}) do
    pid
    |> GenServer.call(:get_data)
  end
end

