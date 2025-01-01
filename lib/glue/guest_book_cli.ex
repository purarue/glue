defmodule Glue.GuestBookComments.CLI do
  @moduledoc """
  This module defines a CLI interface with the guestbook comments
  database contents, its how I approve/deny comments
  """

  alias Glue.Repo
  import Ecto.Query, warn: false

  alias Glue.GuestBookComments
  alias Glue.GuestBookComments.GuestBookComment

  @doc """
  Return any comments which have
  denied: false
  approved: false

  These are items I have to consider
  """
  def new_comments() do
    Repo.all(
      from c in GuestBookComment,
        where: c.approved == false and c.denied == false
    )
  end

  def print_new_comments() do
    new_comments() |> IO.inspect()
  end

  def print_comment(cmnt) do
    IO.puts("#{cmnt.name}\n#{cmnt.comment}")
  end

  def edit_comment() do
    cid = IO.gets("What comment ID to edit? ") |> String.trim() |> String.to_integer()
    cmmnt = GuestBookComments.get_guest_book_comment!(cid)
    IO.inspect(cmmnt)
    new_comment_text = IO.gets("What to edit comment text to? ")
    new_name = IO.gets("What to edit name to? ")

    {:ok, _} =
      GuestBookComments.update_guest_book_comment(cmmnt, %{
        comment: new_comment_text |> String.trim(),
        name: new_name |> String.trim()
      })
  end

  defp approve_prompt_loop(new_comment, prompt \\ nil, error \\ false) do
    if error do
      IO.puts("Didn't receive 'a', 'd', or 'del'")
    end

    IO.inspect(new_comment)
    print_comment(new_comment)

    resp =
      IO.gets(prompt || "Approve Comment? ['a' for approve, 'd' for deny, 'del' for delete] ")
      |> String.trim()

    cond do
      resp == "a" ->
        :approve

      resp == "d" ->
        :deny

      resp == "del" ->
        :delete

      true ->
        approve_prompt_loop(new_comment, prompt, true)
    end
  end

  def prompt(new_comment) do
    case approve_prompt_loop(new_comment) do
      :approve ->
        GuestBookComments.update_guest_book_comment(new_comment, %{approved: true, denied: false})

      :deny ->
        GuestBookComments.update_guest_book_comment(new_comment, %{denied: true, approved: false})

      :delete ->
        GuestBookComments.delete_guest_book_comment(new_comment)
    end
  end

  def prompt_comments([]) do
    IO.puts("Done approving comments!")
  end

  def prompt_comments([new_comment | rest_comments]) do
    prompt(new_comment)
    prompt_comments(rest_comments)
  end

  def main() do
    new_comments()
    |> prompt_comments()
  end

  @doc """
  In case I made a mistake, let me prompt and mark against all current comments
  """
  def all() do
    Repo.all(GuestBookComment)
    |> prompt_comments()
  end

  def new_count() do
    new_count =
      new_comments()
      |> Enum.count()

    IO.puts("COUNT:#{new_count}")
  end
end
