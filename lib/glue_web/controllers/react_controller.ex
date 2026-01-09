defmodule GlueWeb.ReactController do
  use GlueWeb, :controller

  require Logger

  @moduledoc """
  This defines the single entrypoint to the react part of this site.
  react_layout.html has the compiled js bundle as part of the <head>

  If the user is using curl (or maybe in the future, something else as well?)
  instead of a browser, we can render something using ANSI instead
  """

  plug :put_layout, "react_layout.html"

  @links [
    ["Notes/Wiki", "https://purarue.xyz/x/"],
    ["Media Feed", "https://purarue.xyz/feed/"],
    ["Github", "https://purarue.xyz/github"],
    ["Photography", "https://purarue.xyz/photos"],
    ["Projects", "https://purarue.xyz/projects"],
    ["Blog", "https://purarue.xyz/blog"],
    ["RSS", "https://purarue.xyz/x/rss.xml"],
    ["======================", "=============================="],
    ["Letterboxd", "https://purarue.xyz/letterboxd"],
    ["Anilist", "https://purarue.xyz/anilist"],
    ["Albums Spreadsheet", "https://purarue.xyz/albums"],
    ["World Cube Association", "https://purarue.xyz/wca"]
  ]

  # returns a string
  @spec ansi() :: String.t()
  def ansi() do
    figlet =
      "                                       \n _ __  _   _ _ __ __ _ _ __ _   _  ___ \n| '_ \\| | | | '__/ _` | '__| | | |/ _ \\\n| |_) | |_| | | | (_| | |  | |_| |  __/\n| .__/ \\__,_|_|  \\__,_|_|   \\__,_|\\___|\n|_|                                    \n"

    welcome =
      TableRex.Table.new(@links)
      |> TableRex.Table.render!()

    (IO.ANSI.blue() <> IO.ANSI.italic() <> figlet <> IO.ANSI.reset() <> "\n" <> welcome)
    |> String.trim()

    # welcome
  end

  # support xh/curl
  @terminal_filetypes ["xh", "curl"]

  @spec is_terminal(Plug.Conn.t()) :: boolean()
  defp is_terminal(conn) do
    matched_headers =
      conn.req_headers
      |> Enum.filter(fn {k, _} -> String.downcase(k) == "user-agent" end)
      |> Enum.filter(fn {_, v} ->
        String.starts_with?(
          String.downcase(v),
          @terminal_filetypes
        )
      end)

    # IO.inspect(matched_headers)
    matched_headers |> length() > 0
  end

  def catchall(conn, _params) do
    if is_terminal(conn) do
      text(conn, ansi())
    else
      render(conn, "index.html")
    end
  end
end
