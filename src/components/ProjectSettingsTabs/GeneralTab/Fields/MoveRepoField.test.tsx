import userEvent from "@testing-library/user-event";
import { render, fireEvent, waitFor } from "test_utils/test-utils";
import { MoveRepoField, MoveRepoModal } from "./MoveRepoField";

test("does not show the move repo button when not attached to repo", async () => {
  const { queryByDataCy } = render(
    <MoveRepoField
      formData={{}}
      onChange={() => {}}
      schema={{}}
      uiSchema={{
        options: { useRepoSettings: false },
      }}
    />
  );
  expect(queryByDataCy("move-repo-button")).not.toBeInTheDocument();
});

test("clicking the button opens the modal", async () => {
  const { queryByDataCy } = render(
    <MoveRepoField
      formData={{}}
      onChange={() => {}}
      schema={{}}
      uiSchema={{
        options: { useRepoSettings: true },
      }}
    />
  );
  expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();

  const moveRepoButton = queryByDataCy("move-repo-button");
  await fireEvent.click(moveRepoButton);
  await waitFor(() => expect(queryByDataCy("move-repo-modal")).toBeVisible());
});

test("renders the Move Repo Modal when the open prop is true", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { queryByDataCy } = render(
    <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
  );
  expect(queryByDataCy("move-repo-modal")).toBeVisible();
});

test("does not render the Move Repo Modal when the open prop is false", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { queryByDataCy } = render(
    <MoveRepoModal
      onCancel={mockOnCancel}
      onConfirm={mockOnConfirm}
      open={false}
    />
  );
  expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();
});

test("disables the confirm button on initial render", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { getAllByText } = render(
    <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
  );

  const moveRepoButton = getAllByText("Move Repo")[1].closest("button");
  expect(moveRepoButton).toHaveAttribute("disabled");
});

test("disables the confirm button when only owner field is updated", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { getAllByText, queryByDataCy } = render(
    <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
  );
  userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");

  const moveRepoButton = getAllByText("Move Repo")[1].closest("button");
  expect(moveRepoButton).toHaveAttribute("disabled");
});

test("disables the confirm button when only repo field is updated", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { getAllByText, queryByDataCy } = render(
    <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
  );
  userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

  const moveRepoButton = getAllByText("Move Repo")[1].closest("button");
  expect(moveRepoButton).toHaveAttribute("disabled");
});

test("enables the confirm button when both fields are updated", () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const { getAllByText, queryByDataCy } = render(
    <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
  );
  userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");
  userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

  const moveRepoButton = getAllByText("Move Repo")[1].closest("button");
  expect(moveRepoButton).not.toHaveAttribute("disabled");
});
