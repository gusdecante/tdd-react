import ProfileCard from "./ProfileCard";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../../core/test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest, DefaultBodyType } from "msw";

import { storage } from "../../../core/redux/storage";

let count = 0;
let userId = "0";
let requestBody: DefaultBodyType;
let header: string | null;
const server = setupServer(
  rest.put("/api/1.0/users/:id", (req, res, ctx) => {
    count += 1;
    req.json().then((data) => {
      requestBody = data;
    });
    header = req.headers.get("Authorization");
    userId = req.params.id as string;
    return res(ctx.status(200));
  })
);

beforeEach(() => {
  count = 0;
  userId = "0";
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

const defaultStoragedUser = {
  id: 5,
  username: "user5",
  header: "auth header value",
};

const user = userEvent.setup();

describe("Profile card", () => {
  const setup = (user = defaultStoragedUser) => {
    storage.setItem("auth", defaultStoragedUser);
    render(<ProfileCard {...user} />);
  };

  let saveButton: Element;

  const setupInEditMode = async () => {
    setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    saveButton = screen.getByRole("button", { name: "Save" });
  };
  it("display edit button when logged in user is shown on card", () => {
    setup();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
  it("does not display edit button for another user", () => {
    setup({
      id: 2,
      username: "user2",
      header: "",
    });
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument();
  });
  it("displays input for username after clicking edit", async () => {
    setup();
    expect(
      screen.queryByLabelText("Change your username")
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("Change your username")).toBeInTheDocument();
  });
  it("displays save and cancel buttons in edit mode", async () => {
    await setupInEditMode();
    expect(saveButton).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
  it("hides Edit button and username header in edit mode", async () => {
    await setupInEditMode();
    expect(
      screen.queryByRole("heading", { name: "user5" })
    ).not.toBeInTheDocument();
  });
  it("has the current username in input", async () => {
    await setupInEditMode();
    const input = screen.queryByLabelText("Change your username");
    expect(input).toHaveValue("user5");
  });
  it("displays spinner during api call", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
  });
  it("disables the save button during api call", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
    expect(count).toBe(1);
  });
  it("sends request to the endpoint having logged in user id", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
    expect(userId).toBe("5");
  });
  it("sends request with body having updated username", async () => {
    await setupInEditMode();
    const editInput = screen.getByLabelText("Change your username");
    await user.clear(editInput);
    await user.type(editInput, "user5updated");
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
    expect(requestBody).toEqual({ username: "user5updated" });
  });
  it("sends request with authorization header", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
    expect(header).toBe("auth header value");
  });
  it("sends request with body having username even user does not update it", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
    expect(requestBody).toEqual({ username: "user5" });
  });
  it("hides edit layout after successful update", async () => {
    await setupInEditMode();
    await user.click(saveButton);
    const editButton = await screen.findByRole("button", { name: "Edit" });
    expect(editButton).toBeInTheDocument();
  });
  it("updates username in profile card after successful update", async () => {
    await setupInEditMode();
    const editInput = screen.getByLabelText("Change your username");
    await user.clear(editInput);
    await user.type(editInput, "new-username");
    await user.click(saveButton);
    const newUsername = await screen.findByRole("heading", {
      name: "new-username",
    });
    expect(newUsername).toBeInTheDocument();
  });
  it("displays last updated name in input in edit mode after successful username update", async () => {
    await setupInEditMode();
    let editInput = screen.getByLabelText("Change your username");
    await user.clear(editInput);
    await user.type(editInput, "new-username");
    await user.click(saveButton);
    const editButton = await screen.findByRole("button", { name: "Edit" });
    await user.click(editButton);
    editInput = screen.getByLabelText("Change your username");
    expect(editInput).toHaveValue("new-username");
  });
});
