defmodule QuizGame.Router do
  use QuizGame.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", QuizGame do
    pipe_through :browser # Use the default browser stack

    get "/host", PageController, :host
    get "/*page", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", QuizGame do
  #   pipe_through :api
  # end
end
