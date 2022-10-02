import ProfileCard from "./ProfileCard";
import { render, screen } from "../../../core/test/setup";
import { storage } from "../../../core/redux/storage";
import userEvent from "@testing-library/user-event";

const defaultStoragedUser = {
  id: 5,
  username: "user5",
};

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
  it("displays input for username after clicking edit", () => {
    setup();
    expect(
      screen.queryByLabelText("Change your username")
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("Change your username")).toBeInTheDocument();
  });
  it("displays save and cancel buttons in edit mode", () => {
    setup();
    userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
  it("hides Edit button and username header in edit mode", () => {
    setup();
    userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      screen.queryByRole("heading", { name: "user5" })
    ).not.toBeInTheDocument();
  });
  it("has the current username in input", () => {
    setup();
    userEvent.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.queryByLabelText("Change your username");
    expect(input).toHaveValue("user5");
  });
});
