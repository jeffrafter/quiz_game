defmodule QuizGame do
  use Application

  @id_length Application.get_env(:quiz_game, :id_length)

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      supervisor(QuizGame.Repo, []),
      supervisor(QuizGame.Endpoint, []),
      supervisor(QuizGame.Game.Supervisor, []),
      supervisor(Registry, [:unique, :game_registry]),
    ]

    opts = [strategy: :one_for_one, name: QuizGame.Supervisor]

    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    QuizGame.Endpoint.config_change(changed, removed)
    :ok
  end

  @doc """
  Each player needs a unique id, this creates a random one
  """
  def generate_player_id do
    @id_length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64()
    |> binary_part(0, @id_length)
    |> String.upcase
  end

  @doc """
  Each host needs a unique id, this creates a random one
  """
  def generate_host_id do
    @id_length
    |> :crypto.strong_rand_bytes
    |> Base.url_encode64()
    |> binary_part(0, @id_length)
    |> String.upcase
  end
end
