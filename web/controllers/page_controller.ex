defmodule QuizGame.PageController do
  @moduledoc """
  A basic controller to show the primary landing pages.
  """
  use QuizGame.Web, :controller

  @doc """
  Players view the welcome screen and every time they do, we generate
  a new random player id that will be used to identify them when they
  join and play games.
  """
  def index(conn, _params) do
    player_id = conn.cookies["player"] || QuizGame.generate_player_id

    conn
    |> put_resp_cookie("player", player_id, max_age: 24*60*60)
    |> render("index.html", id: player_id)
  end

  @doc """
  When a host views the host page we generate a new random host id that
  will be used to identify them as a host and their game using the same
  id.
  """
  def host(conn, _params) do
    host_id = conn.cookies["host"] || QuizGame.generate_host_id

    conn
    |> put_resp_cookie("host", host_id, max_age: 24*60*60)
    |> render("host.html", id: host_id)
  end
end
