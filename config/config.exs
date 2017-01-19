# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :quiz_game,
  ecto_repos: [QuizGame.Repo]

# General application configuration
config :quiz_game,
  id_length: System.get_env("ID_LENGTH") || 5

# Configures the endpoint
config :quiz_game, QuizGame.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "EfsYcapyvSFCbzDmY6W5j4k4l+DVhwTp44k46rE9acmrAYA87LKP/MJLDcd1TQlp",
  render_errors: [view: QuizGame.ErrorView, accepts: ~w(html json)],
  pubsub: [name: QuizGame.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
