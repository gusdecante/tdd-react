import ProfileCard from "./ProfileCard";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../../core/test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { storage } from "../../../core/redux/storage";

const server = setupServer(
  rest.put("/api/1.0/users/user/:id", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeEach(() => server.resetHandlers());

beforeAll(() => server.listen());

afterAll(() => server.close());

const defaultStoragedUser = {
  id: 5,
  username: "user5",
};

const user = userEvent.setup();

describe("Profile card", () => {
  const setup = (user = defaultStoragedUser) => {
    storage.setItem("auth", defaultStoragedUser);
    render(<ProfileCard {...user} />);
  };
  it("display edit button when logged in user is shown on card", () => {
    setup();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
  it("does not display edit button for another user", () => {
    setup({
      id: 2,
      username: "user2",
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
    setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
  it("hides Edit button and username header in edit mode", async () => {
    setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      screen.queryByRole("heading", { name: "user5" })
    ).not.toBeInTheDocument();
  });
  it("has the current username in input", async () => {
    setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.queryByLabelText("Change your username");
    expect(input).toHaveValue("user5");
  });
  it("displays spinner during api call", async () => {
    setup();
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    const spinner = screen.getByRole("status");
    await waitForElementToBeRemoved(spinner);
  });
});
