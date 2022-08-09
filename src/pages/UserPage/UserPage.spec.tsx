import { render, screen, waitFor } from "../../core/test/setup";
import { UserPage } from "./index";
import { setupServer } from "msw/node";
import { rest } from "msw";
import Router from "react-router-dom";

const server = setupServer();

beforeEach(() => {
  server.resetHandlers();
});

beforeAll(() => server.listen());

afterAll(() => server.close());

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("User Page", () => {
  beforeEach(() => {
    server.use(
      rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        if (req.params.id === "1") {
          return res(
            ctx.json({
              id: 1,
              username: "user1",
              email: "user1@mail.com",
              image: null,
            })
          );
        } else {
          return res(
            ctx.status(404),
            ctx.json({
              message: "User not found",
            })
          );
        }
      })
    );
  });

  it("displays user name on page when user is found", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "1" });
    render(<UserPage />);

    await waitFor(() => {
      expect(screen.getByText("user1")).toBeInTheDocument();
    });
  });
  it("displays spinner while the api call is in progress", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "1" });
    render(<UserPage />);
    const spinner = screen.getByRole("status");
    await screen.findByText("user1");
    expect(spinner).not.toBeInTheDocument();
  });
  it("displays error message received from backend when the user is not found", async () => {
    jest.spyOn(Router, "useParams").mockReturnValue({ id: "100" });
    render(<UserPage />);

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });
});
